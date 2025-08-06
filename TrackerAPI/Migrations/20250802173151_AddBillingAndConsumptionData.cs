using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddBillingAndConsumptionData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TenantId1",
                table: "Invoices",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId1",
                table: "ConsumptionRecords",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_TenantId1",
                table: "Invoices",
                column: "TenantId1");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumptionRecords_TenantId1",
                table: "ConsumptionRecords",
                column: "TenantId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ConsumptionRecords_Tenants_TenantId1",
                table: "ConsumptionRecords",
                column: "TenantId1",
                principalTable: "Tenants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_Tenants_TenantId1",
                table: "Invoices",
                column: "TenantId1",
                principalTable: "Tenants",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ConsumptionRecords_Tenants_TenantId1",
                table: "ConsumptionRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_Tenants_TenantId1",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_TenantId1",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_ConsumptionRecords_TenantId1",
                table: "ConsumptionRecords");

            migrationBuilder.DropColumn(
                name: "TenantId1",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TenantId1",
                table: "ConsumptionRecords");
        }
    }
}
