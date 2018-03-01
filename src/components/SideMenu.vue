  <template>
		<v-navigation-drawer app clipped
		 fixed right
		 permanent
		hide-overlay
		floating
		class="pt-4">
		<SpeedActions
		:child="child"
		:parent="parent"
		@ShowAll="$emit('ShowAll')"
		@toggleFilterChild="$emit('toggleFilter', 'child')"
		@toggleFilterParent="$emit('toggleFilter', 'parent')"
		@ToggleColor="$emit('ToggleColor')" />

			<hr />
		<v-card flat class="mt-1" v-for="(v,i) in tables" :key="i">
			<v-card-title @click="emitToggle(v)" style="boxShadow: 0 2px 3px 0 hsla(0, 0%, 0%, 0.1)" primary-title class="subheader">{{v}}</v-card-title>
		</v-card>
		</v-navigation-drawer>
</template>

<script>
import SpeedActions from './SpeedActions';

export default {
  name: 'SideMenu',
  props: ['tables', 'child', 'parent'],

  data: function() {
    return {}
  },
  methods: {
    emitToggle(tkey) {
      this.$emit('toggle', tkey);
    }
  },
  components: {
    SpeedActions
  },
}
</script>

<style scoped>
.test {
  padding-top: 10px;
  margin-top: 10px;
}
</style>
