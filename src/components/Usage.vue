  <template>
		<div>
	    <h4>Postgres: <code> pg_dump -s databasename > file.sql	</code> </h4>
	    <h4>SQL: <code> mysqldump -u root -p --no-data dbname > schema.sql</code></h4>
	    <h5> Then use that file</h5>
	  </div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Usage',

}
</script>

<style scoped>

</style>
