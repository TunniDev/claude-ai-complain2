<template>
    <div>
      <button class="btn btn-export" @click="exportXlsx">
          <i class="fa-solid fa-file-export icon-style"></i>
          export
      </button>
    </div>
  </template>

  <script>
  // เปลี่ยนจาก vue-excel-xlsx (Vue 2) มาใช้ SheetJS ตรง ๆ
  import * as XLSX from 'xlsx'
  export default {
      props: ['datas', 'columns', 'filename'],
      methods: {
        exportXlsx() {
          const cols = this.columns || []
          const rows = (this.datas || []).map(row => {
            const o = {}
            cols.forEach(c => { o[c.label] = row[c.field] })
            return o
          })
          const ws = XLSX.utils.json_to_sheet(rows, { header: cols.map(c => c.label) })
          const wb = XLSX.utils.book_new()
          const sheetName = `เทศกาล${this.filename || ''}`.substring(0, 31)
          XLSX.utils.book_append_sheet(wb, ws, sheetName)
          XLSX.writeFile(wb, `รายงานลงนามถวายพระพร เทศกาล${this.filename || ''}.xlsx`)
        }
      }
  }
  </script>

  <style>
      .btn-export{
          padding: 5px 7px;
          border-radius: 5px;
          background: #4caf50;
          color: white;
          border: none;
          cursor: pointer;
      }
      .icon-style{
        font-size: 18px;
      }
  </style>
