  <template>
		<v-flex	@click="emitToggle(tKey)">
	<v-card class="drawing" flat
	:style="{ borderColor: color}" >
		<v-card-title primary-title><h2>{{tKey}}</h2></v-card-title>
		<v-flex v-if="toggleInfo" v-for="(v,k) in tValue"
			:key="k">
			<v-card-text class="caption">
				<h3 :style="{color: v in colors ? colors[v]: 'grey'}" >{{k}}</h3> <h4 :style="{color: v in colors ? colors[v] : 'hsl(249,9%,80%)'}">{{v}}</h4>
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
  border-top: 14px solid;
  border-radius: 8px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
}
</style>
