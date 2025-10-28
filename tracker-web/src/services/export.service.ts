import * as XLSX from 'exceljs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { ExportOptions } from '@/types/api.types'

export const exportService = {
  /**
   * Export data to Excel
   */
  async exportToExcel<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions
  ): Promise<void> {
    const workbook = new XLSX.Workbook()
    const worksheet = workbook.addWorksheet('Data')

    // Determine columns
    const columns = options.columns || Object.keys(data[0] || {})
    
    // Add header row
    if (options.includeHeaders !== false) {
      worksheet.addRow(columns)
      
      // Style header row
      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6366F1' },
      }
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }
      })
    }

    // Add data rows
    data.forEach((item) => {
      const row = columns.map((col) => item[col])
      worksheet.addRow(row)
    })

    // Auto-fit columns
    worksheet.columns.forEach((column) => {
      let maxLength = 0
      column?.eachCell?.({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10
        if (columnLength > maxLength) {
          maxLength = columnLength
        }
      })
      column.width = maxLength < 10 ? 10 : maxLength + 2
    })

    // Generate file
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Download file
    const fileName = options.fileName || `export-${Date.now()}.xlsx`
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    URL.revokeObjectURL(link.href)
  },

  /**
   * Export data to PDF
   */
  exportToPDF<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions
  ): void {
    const doc = new jsPDF()

    // Determine columns
    const columns = options.columns || Object.keys(data[0] || {})
    
    // Prepare table data
    const headers = options.includeHeaders !== false ? [columns] : []
    const body = data.map((item) => columns.map((col) => item[col]?.toString() || ''))

    // Generate table
    autoTable(doc, {
      head: headers,
      body: body,
      startY: 20,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [99, 102, 241],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    })

    // Download file
    const fileName = options.fileName || `export-${Date.now()}.pdf`
    doc.save(fileName)
  },

  /**
   * Export data to CSV
   */
  exportToCSV<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions
  ): void {
    const columns = options.columns || Object.keys(data[0] || {})
    
    let csv = ''
    
    // Add header row
    if (options.includeHeaders !== false) {
      csv += columns.join(',') + '\n'
    }

    // Add data rows
    data.forEach((item) => {
      const row = columns.map((col) => {
        const value = item[col]?.toString() || ''
        // Escape commas and quotes
        return value.includes(',') || value.includes('"')
          ? `"${value.replace(/"/g, '""')}"`
          : value
      })
      csv += row.join(',') + '\n'
    })

    // Download file
    const fileName = options.fileName || `export-${Date.now()}.csv`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    URL.revokeObjectURL(link.href)
  },

  /**
   * Generic export function
   */
  async export<T extends Record<string, any>>(
    data: T[],
    options: ExportOptions
  ): Promise<void> {
    switch (options.format) {
      case 'excel':
        return this.exportToExcel(data, options)
      case 'pdf':
        return this.exportToPDF(data, options)
      case 'csv':
        return this.exportToCSV(data, options)
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  },
}

