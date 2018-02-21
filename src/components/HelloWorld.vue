<template>
<v-container fluid>
  <div v-if="noFile">
    <h4>Example: postgresql use : pg_dump -s databasename > file.sql</h4>
    <h4>Example:  sql use mysqldump -u root -p --no-data dbname > schema.sql</h4>
    <h5> Then use that file</h5>
    <v-btn @click="read()">Demo</v-btn>
  </div>
  <div v-else>
    <v-chip v-for="(s,i) in selected"
      col
      wrap
      :color="s === choice? 'amber lighten-2' : selected.indexOf(s) < selected.indexOf(choice) ? 'blue' : 'green'"
      :key="i">{{s}}</v-chip>
    <v-flex align-content-start>
      <h1>click align table</h1>
      <v-switch label="child"
        v-model="child"></v-switch>
      <v-switch label="parent"
        color="green"
        v-model="parent"></v-switch>
    </v-flex>
  </div>

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
import demoColors from '../assets/demoColors';
import demoRef from '../assets/demoRef';
import demoTable from '../assets/demoTable';

export default {
  name: 'HelloWorld',
  components: {
    Table
  },
  data() {
    return {
      noFile: true,
      msg: 'Welcome to Your Vue.js App',
      child: true,
      choice: '',
      parent: true,
      selected: [],
      allTables: {},
      tables: {},
      tableNames: [],
      references: [],
      colors: {},
      text: []
    }
  },
  computed: {},
  watch: {
    child: function() {
      if (this.choice)
        this.doTheThing(this.choice, 'from');
    },
    parent: function() {
      if (this.choice)
        this.doTheThing(this.choice, 'from');
    }
  },
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
      if (!data) {
        this.allTables = demoTable;
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
    },
    // ******** ********  Filter by click  ******** ********
    doTheThing(mainKey, from) {
      if (!mainKey || mainKey == '') {
        return;
      }
      this.choice = mainKey;
      this.selected = [];
      if (!from && Object.keys(this.tables).length !== Object.keys(this.allTables).length) {
        this.choice = '';
        this.tables = this.allTables;
      } else {
        this.selected.push(mainKey);
        this.references.forEach(e => {
          if (this.parent && e.tableName == mainKey) {
            this.selected.push(e.ref);
          }
          if (this.child && e.ref == mainKey) {
            this.selected.unshift(e.tableName);
          }
        })
        this.tables = Object.keys(this.allTables)
          .filter(k => this.selected.includes(k))
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
.list {
  backface-visibility: hidden;
  z-index: 1;
}

/* moving */

.list-move {
  transition: all 800ms ease-in-out 50ms;
}

/* appearing */

.list-enter-active {
  transition: all 800ms ease-out;
}

/* disappearing */

.list-leave-active {
  transition: all 800ms ease-in;
  /* position: absolute; */
  /* z-index: 0; */
}

/* appear at / disappear to */

.list-enter,
.list-leave-to {
  opacity: 0;
}


.rs-flex {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
  /* align-items: center; */
}
</style>
