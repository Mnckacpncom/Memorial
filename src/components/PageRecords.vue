<script>
export default {
	name: "PageRecords",
	data: function() {
		return {
			tableData: [{
				id: 1,
				company: '恒昇',
				Name:'张三',
				Type,
				Mode,
				inTime,
				outTime,
				AccessCard,
				AccessStatus,
				EmployeeID,
				IDCardStatus,
				PrincipalPersoninCharge}
			]
		}
	}
}
</script>

<template>
	<el-table :data="tableData">
		<el-table-column></el-table-column>
		<el-table-column></el-table-column>
		<el-table-column></el-table-column>
		<el-table-column></el-table-column>
		<el-table-column></el-table-column>
	</el-table>
</template>

<style scoped>

</style>