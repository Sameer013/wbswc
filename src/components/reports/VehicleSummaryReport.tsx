import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

import { styles } from './styles/vehicleReport'

export type EventSummaryRecord = {
  id: number
  eventType: string
  eventTimestamp: Date 
  vehicleNo: string
  vehicleWt: number | null
}

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const VehicleSummaryReport = ({ records, fromDate, toDate }: { records: EventSummaryRecord[], fromDate: string, toDate: string }) => {
  const generatedAt = new Date()

  // Format the input strings "YYYY-MM-DD" to standard display dates
  const formatInputDate = (dateStr: string) => {
      try {
          const d = new Date(dateStr)
          
          return formatDate(d)
      } catch (e) {
          return dateStr
      }
  }

  return (
    <Document title={`Vehicle Summary Report (${fromDate} to ${toDate})`} producer='sigma' author='WBSWC'>
      <Page size='A4' style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoIcon} src={'/images/logo1.png'} /> 
            <Image style={styles.logoText} src={'/images/logo2.png'} />
          </View>
          <View>
            <Text style={styles.reportLabel}>VEHICLE SUMMARY REPORT</Text>
            <Text style={{ ...styles.reportId, fontSize: 14 }}>{formatInputDate(fromDate)} to {formatInputDate(toDate)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryBand}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL EVENTS</Text>
            <Text style={styles.summaryValue}>{records.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PERIOD</Text>
            <Text style={styles.summaryValue}>{formatInputDate(fromDate)} - {formatInputDate(toDate)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>EVENTS LOG</Text>
        <View style={styles.table}>
            {/* Table Header */}
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={{...styles.tableCell, flex: 0.5}}>
              <Text style={styles.tableCellValue}>ID</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellValue}>Vehicle No.</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellValue}>Type</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellValue}>Date & Time</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellValue}>Weight</Text>
            </View>
          </View>

          {/* Table Data Rows */}
          {records.length > 0 ? (
            records.map((record, index) => (
                <View key={record.id} style={[styles.tableRow, index === records.length - 1 ? styles.tableRowLast : {}]}>
                    <View style={{...styles.tableCell, flex: 0.5}}>
                        <Text style={styles.tableCellLabel}>#{record.id}</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableCellLabel}>{record.vehicleNo}</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableCellLabel}>{record.eventType}</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableCellLabel}>{formatDate(record.eventTimestamp)} {formatTime(record.eventTimestamp)}</Text>
                    </View>
                    <View style={styles.tableCell}>
                        <Text style={styles.tableCellLabel}>{record.vehicleWt != null ? `${record.vehicleWt.toFixed(2)} T` : '--'}</Text>
                    </View>
                </View>
            ))
          ) : (
            <View style={[styles.tableRow, styles.tableRowLast]}>
                <View style={styles.tableCell}>
                    <Text style={{...styles.tableCellLabel, textAlign: 'center'}}>No vehicle events found for the selected date range.</Text>
                </View>
            </View>
          )}

        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>WB State Warehousing Corporation</Text>
          <Text style={styles.footerText}>Developed by Sigma e Solution Pvt. Ltd.</Text>
          <Text style={styles.footerText}>
            Generated: {formatDate(generatedAt)} {formatTime(generatedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default VehicleSummaryReport
