import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

import { styles } from './styles/vehicleReport'

export type BagSummaryRecord = {
  id: number
  cycle_date: Date | null
  vehicleNo: string | null
  type_of_event: string | null
  cnt: number | null
  created_at: Date | null
  start_time: Date | null
  end_time: Date | null
  imageId: number | null
}

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const BagsSummaryReport = ({
  records,
  fromDate,
  toDate
}: {
  records: BagSummaryRecord[]
  fromDate: string
  toDate: string
}) => {
  const generatedAt = new Date()

  const formatInputDate = (dateStr: string) => {
    try {
      return formatDate(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  // Derive totals from type_of_event + cnt
  const totalLoads = records
    .filter(r => r.type_of_event?.toLowerCase() === 'load')
    .reduce((sum, r) => sum + (r.cnt ?? 0), 0)

  const totalUnloads = records
    .filter(r => r.type_of_event?.toLowerCase() === 'unload')
    .reduce((sum, r) => sum + (r.cnt ?? 0), 0)

  return (
    <Document title={`Bags Summary Report (${fromDate} to ${toDate})`} producer='sigma' author='WBSWC'>
      <Page size='A4' orientation='portrait' style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoIcon} src={'/images/logo1.png'} />
            <Image style={styles.logoText} src={'/images/logo2.png'} />
          </View>
          <View>
            <Text style={styles.reportLabel}>BAGS SUMMARY REPORT</Text>
            <Text style={{ ...styles.reportId, fontSize: 14 }}>
              {formatInputDate(fromDate)} to {formatInputDate(toDate)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Summary Band */}
        <View style={styles.summaryBand}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL BAGS LOADS</Text>
            <Text style={styles.summaryValue}>{totalLoads}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL BAGS UNLOADS</Text>
            <Text style={styles.summaryValue}>{totalUnloads}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PERIOD</Text>
            <Text style={styles.summaryValue}>
              {formatInputDate(fromDate)} - {formatInputDate(toDate)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>BAGS SUMMARY</Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={{ ...styles.tableCell, flex: 0.3 }}>
              <Text style={styles.tableCellValue}>ID</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 0.8 }}>
              <Text style={styles.tableCellValue}>Date</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>Vehicle No</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>Time (In)</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>Time (Out)</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 2, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>Event Activity (Load / Unload)</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>Count</Text>
            </View>
          </View>

          {/* Data Rows */}
          {records.length > 0 ? (
            records.map((record, index) => (
              <View key={record.id} style={[styles.tableRow, index === records.length - 1 ? styles.tableRowLast : {}]}>
                <View style={{ ...styles.tableCell, flex: 0.3 }}>
                  <Text style={styles.tableCellLabel}>#{record.id}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 0.8 }}>
                  <Text style={styles.tableCellLabel}>{record.cycle_date ? formatDate(record.cycle_date) : '--'}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.vehicleNo ?? '--'}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.start_time ? formatTime(record.start_time) : '--'}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.end_time ? formatTime(record.end_time) : '--'}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 2, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.type_of_event ?? '--'}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.cnt ?? '--'}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <View style={styles.tableCell}>
                <Text style={{ ...styles.tableCellLabel, textAlign: 'center' }}>
                  No bag summary records found for the selected date range.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>WB State Warehousing Corporation</Text>
          <Text style={styles.footerText}>
            Generated: {formatDate(generatedAt)} {formatTime(generatedAt)}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default BagsSummaryReport
