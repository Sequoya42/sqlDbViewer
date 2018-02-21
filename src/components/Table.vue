  <template>
	<v-card class="drawing"
	:style="{borderTop: '6px solid', borderColor: color}" >
		<v-card-title primary-title><h1>{{tKey}}</h1></v-card-title>
		<v-flex v-for="(v,k) in tValue"
			:key="k">
			<v-card-text>
				<h5>{{k}}</h5> <span :style="{color: v == 'foreign' ? 'red' : 'hsl(249,9%,80%)'}">{{v}}</span>
 </v-card-text>
		</v-flex>
		<v-card-text></v-card-text>
	</v-card>
</template>

<script>
export default {
  name: 'Table',
  props: ['tKey', 'tValue', 'color', 'colors'],

  data: function() {
    return {}
  },
  computed: {},
  methods: {
    colorGen: function() {
      let color = []
      color[0] = Math.random() * Math.floor(360);
      color[1] = `${Math.random() * Math.floor(80) + 20}%`;
      color[2] = `${Math.random() * Math.floor(80) }%`;
      // let color = "#" + ((1 << 24) * Math.random() | 0).toString(16)
      return {
        borderTop: "5px solid",
        borderColor: `hsl(${color[0]}, ${color[1]}, ${color[2]})`
      }
    },
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
