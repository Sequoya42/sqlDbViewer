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
      tables: {},
      references: {},
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
      const subRegex = /FOREIGN KEY \([`]?(\w+)[`]?\) REFERENCES (.[^(]+)/g;
      let m, n;
      while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        let z = m[2].split(',').map(e => e.trim()).filter(e => !(e.startsWith('CONSTRAINT') || e.startsWith('KEY') || e.startsWith('PRIMARY')));
        let zz = {};
        z.map(e => {
          let x = e.split(' ');
          zz[[x[0]]] = x[1];
        })
        this.$set(this.tables, m[1], zz);
        this.$set(this.colors, m[1], this.colorGen())
      }
      while ((n = subRegex.exec(str)) !== null) {
        if (n.index === subRegex.lastIndex) {
          subRegex.lastIndex++;
        }
        this.references[[n[2]]] = n[1];
      }

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
      console.log('text', this.text)
    }
  }
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
