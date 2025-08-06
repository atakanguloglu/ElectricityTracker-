using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddSubscriptionPlanToInvoice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BillingPeriod",
                table: "Invoices",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionPlanId",
                table: "Invoices",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_SubscriptionPlanId",
                table: "Invoices",
                column: "SubscriptionPlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Invoices_SubscriptionPlans_SubscriptionPlanId",
                table: "Invoices",
                column: "SubscriptionPlanId",
                principalTable: "SubscriptionPlans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Invoices_SubscriptionPlans_SubscriptionPlanId",
                table: "Invoices");

            migrationBuilder.DropIndex(
                name: "IX_Invoices_SubscriptionPlanId",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "BillingPeriod",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "SubscriptionPlanId",
                table: "Invoices");
        }
    }
}
