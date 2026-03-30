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
export type EventSummaryRecord2 = {
  id: number
  vehicleNo: string | number
  entry_time: Date
  weight_time: Date
  exit_time: Date
  weight: number | null
  total_minutes: number | null
  cycle_date: Date | null
  created_at: Date | null
}

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const VehicleSummaryReport = ({
  records,
  fromDate,
  toDate
}: {
  records: EventSummaryRecord2[] //changing it to for new Types
  fromDate: string
  toDate: string
}) => {
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
      <Page size='A4' orientation='landscape' style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoIcon} src={'/images/logo1.png'} />
            <Image style={styles.logoText} src={'/images/logo2.png'} />
          </View>
          <View>
            <Text style={styles.reportLabel}>VEHICLE SUMMARY REPORT</Text>
            <Text style={{ ...styles.reportId, fontSize: 14 }}>
              {formatInputDate(fromDate)} to {formatInputDate(toDate)}
            </Text>
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
            <Text style={styles.summaryValue}>
              {formatInputDate(fromDate)} - {formatInputDate(toDate)}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>EVENTS REPORT</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={{ ...styles.tableCell, flex: 0.3 }}>
              <Text style={styles.tableCellValue}>ID</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1.2 }}>
              <Text style={styles.tableCellValue}>Vehicle No.</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1.4 }}>
              <Text style={styles.tableCellValue}>Entry Time</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={styles.tableCellValue}>Tear Weight</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1.4 }}>
              <Text style={styles.tableCellValue}>Tear Weight Time</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={styles.tableCellValue}>Gross Weight</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1.4 }}>
              <Text style={styles.tableCellValue}>Gross Weight Time</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1 }}>
              <Text style={styles.tableCellValue}>Net Weight</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1.4 }}>
              <Text style={styles.tableCellValue}>Exit Time</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 0.8 }}>
              <Text style={styles.tableCellValue}>Duration</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 0.9 }}>
              <Text style={styles.tableCellValue}>Date</Text>
            </View>
          </View>

          {/* Table Data Rows */}
          {records.length > 0 ? (
            records.map((record, index) => (
              <View key={record.id} style={[styles.tableRow, index === records.length - 1 ? styles.tableRowLast : {}]}>
                <View style={{ ...styles.tableCell, flex: 0.3 }}>
                  <Text style={styles.tableCellLabel}>#{record.id}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1.2 }}>
                  <Text style={styles.tableCellLabel}>{record.vehicleNo}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1.4 }}>
                  <Text style={styles.tableCellLabel}>
                    {formatDate(record.entry_time)} {formatTime(record.entry_time)}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'right' }}>
                  <Text style={styles.tableCellLabel}>
                    {record.weight != null ? `${record.weight.toFixed(2)} T` : '--'}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1.4 }}>
                  <Text style={styles.tableCellLabel}>
                    {formatDate(record.weight_time)} {formatTime(record.weight_time)}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 0.8, textAlign: 'right' }}>
                  <Text style={styles.tableCellLabel}>
                    {record.weight != null ? `${record.weight.toFixed(2)} T` : '--'}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1.4 }}>
                  <Text style={styles.tableCellLabel}>
                    {formatDate(record.weight_time)} {formatTime(record.weight_time)}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 0.8, textAlign: 'right' }}>
                  <Text style={styles.tableCellLabel}>
                    {record.weight != null ? `${record.weight.toFixed(2)} T` : '--'}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1.4 }}>
                  <Text style={styles.tableCellLabel}>
                    {formatDate(record.exit_time)} {formatTime(record.exit_time)}
                  </Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 0.8, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.total_minutes ?? '--'}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 0.9 }}>
                  <Text style={styles.tableCellLabel}>{record.cycle_date ? formatDate(record.cycle_date) : '--'}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={[styles.tableRow, styles.tableRowLast]}>
              <View style={styles.tableCell}>
                <Text style={{ ...styles.tableCellLabel, textAlign: 'center' }}>
                  No vehicle events found for the selected date range.
                </Text>
              </View>
            </View>
          )}
        </View>

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

export default VehicleSummaryReport
