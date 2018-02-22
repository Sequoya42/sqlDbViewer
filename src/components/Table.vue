  <template>
		<v-flex	@click="emitToggle(tKey)">
	<v-card class="drawing" flat
	:style="{ borderTop: '14px solid',  borderRadius: '8px', borderColor: color, boxShadow: `0 4px 6px 0 hsla(0, 0%, 0%, 0.2)`}" >
		<v-card-title primary-title><h1>{{tKey}}</h1></v-card-title>
		<v-flex v-if="toggleInfo" v-for="(v,k) in tValue"
			:key="k">
			<v-card-text>
				<h2 :style="{color: v in colors ? colors[v]: 'grey'}" >{{k}}</h2> <h3 :style="{color: v in colors ? colors[v] : 'hsl(249,9%,80%)'}">{{v}}</h3>
 </v-card-text>
		</v-flex>
		<v-card-text></v-card-text>
	</v-card>
</v-flex>
</template>

<script>
export default {
  name: 'Table',
  props: ['tKey', 'tValue', 'color', 'colors', 'toggleInfo'],

  data: function() {
    return {}
  },
  computed: {},
  methods: {
    emitToggle(tkey) {
      this.$emit('toggle', tkey);
    }
  },
  components: {},
}
</script>

<style scoped>
.drawing {
  margin: 2vh;
  padding: 2vh;
}
</style>
