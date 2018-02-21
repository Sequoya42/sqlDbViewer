<template>
<v-container fluid>
  <h4>Example: postgresql use : pg_dump -s databasename > file.sql</h4>
  <h4>Example:  sql use mysqldump -u root -p --no-data dbname > schema.sql</h4>
  <h5> Then use that file</h5>
  <input type="file"
    multiple
    @change='read' />
  <v-layout wrap
    v-model="tables">
    <transition-group name="list"
      class="rs-flex">
      <v-flex v-for="(value, key) in tables"
        :key='key'>
        <Table :tKey="key"
          @toggle="doTheThing"
          :color="colors[key]"
          :colors="colors"
          :tValue="value"> </Table>
      </v-flex>
    </transition-group>
  </v-layout>
</v-container>
</template>

<script>
import Table from './Table';
export default {
  name: 'HelloWorld',
  components: {
    Table
  },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      allTables: {},
      tables: {},
      tableNames: [],
      references: [],
      colors: {},
      text: []
    }
  },
  computed: {},
  methods: {
    colorGen: function() {
      let color = []
      color[0] = Math.random() * Math.floor(360);
      color[1] = `${Math.random() * Math.floor(80) + 20}%`;
      color[2] = `${Math.random() * Math.floor(80) }%`;
      return `hsl(${color[0]}, ${color[1]}, ${color[2]})`

    },

    // ******** ********  parseKnex  ******** ********
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
    // ******** ********  Read  ******** ********
    read(data) {
      let files = data.target.files;
      for (let i = 0, file; file = files[i]; i++) {
        let reader = new FileReader();
        reader.onload = e => {
          this.text.push(e.target.result.replace(/\(\s/g, "∆").replace(/\)(;| E)/g, "Ω").replace(/\n|\r/g, ""));
          this.parseKnex(this.text[i]);
        };
        reader.readAsText(file);
      }
    },
    doTheThing(mainKey) {
      if (Object.keys(this.tables).length !== Object.keys(this.allTables).length) {
        this.tables = this.allTables;
      } else {
        let x = [mainKey];
        this.references.forEach(e => {
          if (e.tableName == mainKey)
            x.push(e.ref);
        })
        this.tables = Object.keys(this.allTables)
          .filter(k => x.includes(k))
          .reduce((obj, key) => {
            obj[key] = this.allTables[key];
            return obj;
          }, {})
      }
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.rs-flex {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
</style>

/*
createTableIfNotExists\((.[^,]*)|{\}

createTableIfNotExists\((.[^,]*),.[^\{]*{(.[^\}]*)

createTableIfNotExists\((.[^,]*),.[^\{]*{.[^.]*(.[^\}|.]*)


createTableIfNotExists\((.[^,]*),.[^\(]*\((.[^\)]*)\).[^\{]*\{(.[^\}]*)\}


createTable.[^\(]+\((.[^,]*),.[^\(]*\(.[^\{]*\{


--------------

createTable.[^\(]+\((.[^,]*),.[^\(]*\(.[^\{]*\{(.[^\}]*)\}

(?=increments|string|boolean|timestamp).[^\(]*\(['|"](\w+)['|"], *(\d*)
-------------
/(?=(increments|string|boolean|timestamp)\(['|"](\w+))/g

sql

FOREIGN KEY \([`]?(\w+)[`]?\) REFERENCES (.[^(]+)



*/
