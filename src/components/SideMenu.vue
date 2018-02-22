  <template>
		<v-navigation-drawer app clipped
		 fixed right
		permanent
		hide-overlay
		mini-variant.sync width="150">
		<v-switch  label="Refered by"
			v-model="theChild"></v-switch>
		<v-switch label="Reference"
			color="green"
			v-model="theParent"></v-switch>
<v-spacer><hr /></v-spacer>
		<v-card v-for="(v,i) in tables" :key="i">
			<v-card-title @click="emitToggle(v)" primary-title>{{v}}</v-card-title>
		</v-card>
		</v-navigation-drawer>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SideMenu',
  props: ['tables', 'child', 'parent'],

  data: function() {
    return {}
  },
  computed: {
    theChild: {
      get() {
        return this.child
      },
      set() {
        console.log('from cjild');
        this.$emit('toggleFilter', 'child')
      }
    },
    theParent: {
      get() {
        return this.parent
      },
      set() {
        this.$emit('toggleFilter', 'parent')
      }
    }
  },
  methods: {
    emitToggle(tkey) {
      this.$emit('toggle', tkey);
    }
  },
  components: {},
}
</script>

<style scoped>
</style>
