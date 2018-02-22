<template>
<v-container fluid>
  <v-layout style="padding-bottom:5vh"
    align-center
    justify-center
    align-content-center>
    <input type="file"
      @change='read' />
    <v-btn v-if="noFile"
      @click="read()">Demo</v-btn>
  </v-layout>
  <div v-if="noFile">
    <h4>Postgres: <code> pg_dump -s databasename > file.sql	</code> </h4>
    <h4>SQL: <code> mysqldump -u root -p --no-data dbname > schema.sql</code></h4>
    <h5> Then use that file</h5>
  </div>
  <div v-else>
    <v-switch v-model="toggleInfo"
      label="show and hide info"></v-switch>
    <v-btn fab
      color="teal"
      fixed
      bottom
      left
      @click="showAll">
      All
    </v-btn>
    <p class="subheading">
      Click on a table and see what happens
    </p>
    <p class="caption">
      Use cmd/ctrl <b><i>+  -   0</i></b> to zoom/dezoom/orginal size
    </p>
    <v-chip v-for="(s,i) in selected"
      col
      wrap
      :color="s === choice? 'amber lighten-2' : selected.indexOf(s) < selected.indexOf(choice) ? 'blue' : 'green'"
      :key="i">{{s}}</v-chip>
    <SideMenu @toggleFilter="doTheThingFromChild"
      @toggle="doTheThing"
      :child="child"
      :parent="parent"
      :tables="Object.keys(tables).sort()"></SideMenu>
    <v-content>
      <v-layout wrap
        v-model="tables">
        <transition-group name="list"
          class="rs-flex">
          <v-flex v-for="(value, key) in tables"
            :key='key'>
            <Table :tKey="key"
              @toggle="doTheThing"
              :toggleInfo="toggleInfo"
              :color="colors[key]"
              :colors="colors"
              :tValue="value"> </Table>
          </v-flex>
        </transition-group>
      </v-layout>
    </v-content>
  </div>
</v-container>
</template>

<script>
import Table from './Table';
import SideMenu from './SideMenu';
import demoColors from '../assets/demoColors';
import demoRef from '../assets/demoRef';
import demoTable from '../assets/demoTable';

export default {
  name: 'HelloWorld',
  components: {
    Table,
    SideMenu,
  },
  data() {
    return {
      noFile: true,
      msg: 'Welcome to Your Vue.js App',
      child: true,
      toggleInfo: true,
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
    // ******** ********  showAll  ******** ********
    showAll() {
      this.tables = this.allTables;
    },
    // ******** ********  From child  ******** ********
    doTheThingFromChild(name) {
      if (name == 'child')
        this.child = !this.child;
      else if (name == 'parent')
        this.parent = !this.parent;
      this.doTheThing(this.choice, 'from')
    },
    // ******** ********  Filter by click  ******** ********
    doTheThing(mainKey, from) {
      console.log('doTheThing', mainKey, from);
      if (!mainKey || mainKey == '') {
        return;
      }
      this.choice = mainKey;
      this.selected = [];
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
  transition: all 800ms cubic-bezier(.25, .8, .25, 1);
  /* transition: all 800ms ease-in-out 50ms; */
}

/* appearing */

.list-enter-active {
  transition: all 800ms cubic-bezier(.25, .8, .25, 1);
  /* transition: all 800ms ease-out; */
}

/* disappearing */

.list-leave-active {
  transition: all 800ms cubic-bezier(.25, .8, .25, 1);
  /* transition: all 800ms ease-in; */
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
