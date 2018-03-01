  <template>
<div>
	<v-layout>
	<v-switch  class="ml-2" label="Referred by"
				v-model="theChild"></v-switch>
			<v-switch class="ml-2, pb-2" label="Reference to"
				color="green"
				v-model="theParent"></v-switch>
			</v-layout>
<v-btn
flat
fab
	color="teal"
	@click="$emit('ShowAll')">
	All
</v-btn>
<v-btn fab flat
	color="blue"
	@click="$emit('ToggleColor')">
	Color
</v-btn>
</div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SpeedActions',
  props: ['child', 'parent'],
  computed: {
    theChild: {
      get() {
        return this.child
      },
      set() {
        this.$emit('toggleFilterChild')
      }
    },
    theParent: {
      get() {
        return this.parent
      },
      set() {
        this.$emit('toggleFilterParent')
      }
    }
  },

}
</script>

<style scoped>

</style>
