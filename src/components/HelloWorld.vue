//TODO
/*
	Parse file, get knex stuff, render it properly
*/

<template>
<div class="hello">
  <input type="file"
    multiple
    @change='read' />
  <v-layout v-model="test">
    <v-flex v-for="(value, key) in test"
      :key='key'>
      <v-card v-model="test">
        <v-card-title primary-title>{{key}}</v-card-title>
        <v-flex v-for="(v,k) in value"
          :key="k">
          <v-card-text>
            {{v}} </v-card-text>
        </v-flex>
        <v-card-text></v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      test: {},
      text: []
    }
  },
  methods: {
    parse(str) {
      const regex = /createTable.[^\(]+\((.[^,]*),.[^\(]*\(.[^\{]*\{(.[^\}]*)\}/g;
      const subRegex = /(?=(increments|string|boolean|timestamp|integer|foreign)\(['|"](\w+))/g;
      let m, n;
      while ((m = regex.exec(str)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        let k = [];
        while ((n = subRegex.exec(m[2])) !== null) {
          if (n.index === subRegex.lastIndex) {
            subRegex.lastIndex++;
          }
          k.push({
            [n[1]]: n[2]
          });
        }
        console.log('k', k)
        this.$set(this.test, m[1], k);
        // this.test[m[1]] = k;
      }
    },
    read(data) {
      let files = data.target.files;
      for (let i = 0, file; file = files[i]; i++) {
        let reader = new FileReader();
        reader.onload = e => {
          this.text.push(e.target.result.replace(/\n|\r/g, ""));
          this.parse(this.text[0]);
          console.log('-------------')
        };
        reader.readAsText(file);
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
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
*/
