using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TrackerAPI.Migrations
{
    /// <inheritdoc />
    public partial class CompleteSystemSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactRequests_Tenants_TenantId",
                table: "ContactRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactRequests_Users_AssignedToUserId",
                table: "ContactRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_HelpArticles_Tenants_TenantId",
                table: "HelpArticles");

            migrationBuilder.DropForeignKey(
                name: "FK_HelpArticles_Users_AuthorId",
                table: "HelpArticles");

            migrationBuilder.DropForeignKey(
                name: "FK_HelpCategories_HelpCategories_ParentCategoryId",
                table: "HelpCategories");

            migrationBuilder.DropIndex(
                name: "IX_HelpCategories_Name",
                table: "HelpCategories");

            migrationBuilder.DropIndex(
                name: "IX_HelpCategories_SortOrder",
                table: "HelpCategories");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_AuthorId",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_CategoryId_Status",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_Slug",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_TenantId_Status",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_Title",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_ContactRequests_Category",
                table: "ContactRequests");

            migrationBuilder.DropIndex(
                name: "IX_ContactRequests_CreatedAt",
                table: "ContactRequests");

            migrationBuilder.DropIndex(
                name: "IX_ContactRequests_Priority",
                table: "ContactRequests");

            migrationBuilder.DropIndex(
                name: "IX_ContactRequests_Status",
                table: "ContactRequests");

            migrationBuilder.DropIndex(
                name: "IX_ContactRequests_TenantId_Status",
                table: "ContactRequests");

            migrationBuilder.DropColumn(
                name: "AllowComments",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "ArchivedAt",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "ArchivedBy",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "Attachments",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "Author",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "CommentCount",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "LastViewedAt",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "MetaKeywords",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "MetaTitle",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "RatingCount",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "RelatedArticleIds",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "ShareCount",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "Tags",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "HelpArticles");

            migrationBuilder.RenameColumn(
                name: "TenantId",
                table: "HelpArticles",
                newName: "HelpCategoryId");

            migrationBuilder.RenameColumn(
                name: "Summary",
                table: "HelpArticles",
                newName: "SeoKeywords");

            migrationBuilder.RenameColumn(
                name: "RequireAuthentication",
                table: "HelpArticles",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "MetaDescription",
                table: "HelpArticles",
                newName: "SeoDescription");

            migrationBuilder.AlterColumn<string>(
                name: "Icon",
                table: "HelpCategories",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "HelpCategories",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "HelpCategories",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "HelpCategories",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "HelpArticles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "HelpArticles",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "HelpArticles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AuthorId",
                table: "HelpArticles",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthorName",
                table: "HelpArticles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SeoTitle",
                table: "HelpArticles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HelpArticleInteractions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ArticleId = table.Column<int>(type: "integer", nullable: false),
                    Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(45)", maxLength: 45, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HelpArticleInteractions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HelpArticleInteractions_HelpArticles_ArticleId",
                        column: x => x.ArticleId,
                        principalTable: "HelpArticles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HelpCategories_Slug",
                table: "HelpCategories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_CategoryId",
                table: "HelpArticles",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_HelpCategoryId",
                table: "HelpArticles",
                column: "HelpCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_IsActive",
                table: "HelpArticles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_Slug",
                table: "HelpArticles",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_TenantId",
                table: "ContactRequests",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticleInteractions_ArticleId",
                table: "HelpArticleInteractions",
                column: "ArticleId");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticleInteractions_CreatedAt",
                table: "HelpArticleInteractions",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticleInteractions_Type",
                table: "HelpArticleInteractions",
                column: "Type");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactRequests_Tenants_TenantId",
                table: "ContactRequests",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactRequests_Users_AssignedToUserId",
                table: "ContactRequests",
                column: "AssignedToUserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HelpArticles_HelpCategories_HelpCategoryId",
                table: "HelpArticles",
                column: "HelpCategoryId",
                principalTable: "HelpCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HelpCategories_HelpCategories_ParentCategoryId",
                table: "HelpCategories",
                column: "ParentCategoryId",
                principalTable: "HelpCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactRequests_Tenants_TenantId",
                table: "ContactRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_ContactRequests_Users_AssignedToUserId",
                table: "ContactRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_HelpArticles_HelpCategories_HelpCategoryId",
                table: "HelpArticles");

            migrationBuilder.DropForeignKey(
                name: "FK_HelpCategories_HelpCategories_ParentCategoryId",
                table: "HelpCategories");

            migrationBuilder.DropTable(
                name: "HelpArticleInteractions");

            migrationBuilder.DropIndex(
                name: "IX_HelpCategories_Slug",
                table: "HelpCategories");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_CategoryId",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_HelpCategoryId",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_IsActive",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_HelpArticles_Slug",
                table: "HelpArticles");

            migrationBuilder.DropIndex(
                name: "IX_ContactRequests_TenantId",
                table: "ContactRequests");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "HelpCategories");

            migrationBuilder.DropColumn(
                name: "AuthorName",
                table: "HelpArticles");

            migrationBuilder.DropColumn(
                name: "SeoTitle",
                table: "HelpArticles");

            migrationBuilder.RenameColumn(
                name: "SeoKeywords",
                table: "HelpArticles",
                newName: "Summary");

            migrationBuilder.RenameColumn(
                name: "SeoDescription",
                table: "HelpArticles",
                newName: "MetaDescription");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "HelpArticles",
                newName: "RequireAuthentication");

            migrationBuilder.RenameColumn(
                name: "HelpCategoryId",
                table: "HelpArticles",
                newName: "TenantId");

            migrationBuilder.AlterColumn<string>(
                name: "Icon",
                table: "HelpCategories",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "HelpCategories",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Color",
                table: "HelpCategories",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "HelpArticles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "HelpArticles",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "HelpArticles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<int>(
                name: "AuthorId",
                table: "HelpArticles",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "AllowComments",
                table: "HelpArticles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "ArchivedAt",
                table: "HelpArticles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ArchivedBy",
                table: "HelpArticles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Attachments",
                table: "HelpArticles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Author",
                table: "HelpArticles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AverageRating",
                table: "HelpArticles",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "CommentCount",
                table: "HelpArticles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "HelpArticles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "HelpArticles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "HelpArticles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastViewedAt",
                table: "HelpArticles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaKeywords",
                table: "HelpArticles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaTitle",
                table: "HelpArticles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RatingCount",
                table: "HelpArticles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RelatedArticleIds",
                table: "HelpArticles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShareCount",
                table: "HelpArticles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Tags",
                table: "HelpArticles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "HelpArticles",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_HelpCategories_Name",
                table: "HelpCategories",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_HelpCategories_SortOrder",
                table: "HelpCategories",
                column: "SortOrder");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_AuthorId",
                table: "HelpArticles",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_CategoryId_Status",
                table: "HelpArticles",
                columns: new[] { "CategoryId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_Slug",
                table: "HelpArticles",
                column: "Slug");

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_TenantId_Status",
                table: "HelpArticles",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_HelpArticles_Title",
                table: "HelpArticles",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_Category",
                table: "ContactRequests",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_CreatedAt",
                table: "ContactRequests",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_Priority",
                table: "ContactRequests",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_Status",
                table: "ContactRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_ContactRequests_TenantId_Status",
                table: "ContactRequests",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.AddForeignKey(
                name: "FK_ContactRequests_Tenants_TenantId",
                table: "ContactRequests",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_ContactRequests_Users_AssignedToUserId",
                table: "ContactRequests",
                column: "AssignedToUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_HelpArticles_Tenants_TenantId",
                table: "HelpArticles",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_HelpArticles_Users_AuthorId",
                table: "HelpArticles",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_HelpCategories_HelpCategories_ParentCategoryId",
                table: "HelpCategories",
                column: "ParentCategoryId",
                principalTable: "HelpCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
