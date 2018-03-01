import demoColors from '../assets/demoColors';
import demoRef from '../assets/demoRef';
import demoTable from '../assets/demoTable';


export default {

  colorGen() {
    let color = []
    color[0] = Math.random() * Math.floor(90) + Math.random() * Math.floor(180) + Math.random() * Math.floor(90);
    color[1] = `${25 + Math.random() * Math.floor(75)}%`;
    color[2] = `${20 + Math.random() * Math.floor(50) }%`;
    return `hsl(${color[0]}, ${color[1]}, ${color[2]})`
  },

  parseKnex(str) {
    //TODO : better regex, also for .sql type
    const regex = /CREATE TABLE `?(\w+)`? ?∆(.[^Ω]*)Ω/g;
    const subRegex = /CONSTRAINT `?(\w+)`? FOREIGN KEY \([`]?(\w+)[`]?\) REFERENCES (.[^(]+)/g;
    let m, n;
    let i = 1;
    while ((m = regex.exec(str)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      let content = m[2].split(',').map(e => e.trim()).filter(e => !(e.startsWith('CONSTRAINT') || e.startsWith('KEY') || e.startsWith('PRIMARY')));
      let realContent = {};
      content.map((e, i) => {
        let x = e.split(' ');
        realContent[[x[0].replace(/`| /g, '')]] = x[1] + (x[1] == 'character' ?
          ' ' + x[2].split('(')[1].split(')')[0] : '');
      })
      this.tableNames.push([m[1], i++]);
      this.$set(this.tables, m[1], realContent);
      this.$set(this.colors, m[1], this.colorGen())
    }
    while ((n = subRegex.exec(str)) !== null) {
      if (n.index === subRegex.lastIndex) {
        subRegex.lastIndex++;
      }
      let tableName = n[1].replace(/_\w[^_]+_id_foreign/, '');
      let ref = n[3].replace(/`| /g, '');
      this.references.push({
        tableName,
        ref,
        val: n[2]
      })
      if (tableName in this.tables) {
        this.tables[tableName][
          [n[2]]
        ] = ref
      }
    }
    this.allTables = Object.assign({}, this.tables);
  },

  read(data) {
    if (!data) {
      this.allTables = demoTable;
      this.tableNames = [
        ["account_validation", 1],
        ["companies", 2],
        ["company_members", 3],
        ["profiles", 4],
        ["project_members", 5],
        ["project_owner", 6],
        ["projects", 7],
        ["tags", 8],
        ["tasks", 9],
        ["user_tags", 10],
        ["users", 11]
      ]
      this.tables = demoTable;
      this.colors = demoColors;
      this.references = demoRef;
      this.noFile = false;
      return;
    }
    // line below from ifnot https://github.com/vuejs/vue/issues/702
    Object.assign(this.$data, this.$options.data.apply(this))
    let files = data.target.files;
    for (let i = 0, file; file = files[i]; i++) {
      let reader = new FileReader();
      reader.onload = e => {
        this.text.push(e.target.result.replace(/\(\s/g, "∆").replace(/\)(;| E)/g, "Ω").replace(/\n|\r/g, ""));
        this.parseKnex(this.text[i]);
      };
      reader.readAsText(file);
    }
    this.noFile = false;
  }

}