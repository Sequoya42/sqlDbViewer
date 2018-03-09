<template>
<v-container fluid
  app>
  <v-layout style="padding-bottom:5vh"
    class="pt-5"
    align-center
    justify-center
    align-content-center>
    <input type="file"
      @change='read' />
    <v-btn v-if="noFile"
      @click="read()">Demo</v-btn>
  </v-layout>
  <Usage v-if="noFile"></Usage>
  <div v-else>
    <v-switch v-model="toggleInfo"
      label="show and hide info"></v-switch>

    <p class="subheading">
      Click on a table and see what happens
    </p>
    <p class="caption">
      Use cmd/ctrl <b><i>+  -   0</i></b> to zoom/dezoom/orginal size
    </p>

    <SideMenu @toggleFilter="doTheThingFromChild"
      @toggle="doTheThing"
      @ShowAll="showAll"
      @ToggleColor="toggleColor"
      :child="child"
      :parent="parent"
      :tables="Object.keys(tables).sort()"></SideMenu>

    <v-content>
      <v-chip @click="doTheThing(s)"
        v-for="(s,i) in selected"
        :key="i"
        :color="s === choice? 'amber lighten-2' : selected.indexOf(s) < selected.indexOf(choice) ? 'blue' : 'green'">{{s}}</v-chip>
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
import Usage from './Usage';
import Table from './Table';
import SideMenu from './SideMenu';
import SpeedActions from './SpeedActions';
import ReadAndParse from '@/utils/ReadAndParse.js';

export default {
  name: 'HelloWorld',
  components: {
    Table,
    Usage,
    SideMenu,
    SpeedActions
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
  methods: {
    ...ReadAndParse,

    toggleColor() {
      this.tableNames.forEach(e => {
        let color = this.colorGen();
        this.$set(this.colors, e[0], this.colorGen())
      })
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
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../css/MainView.css" scoped>
</style>
