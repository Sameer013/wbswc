import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

import { styles } from './styles/vehicleReport'

export type BagSummaryRecord = {
  id: number
  vehicleNo?: string | number
  entryCnt: bigint
  exitCnt: bigint
  loadCnt: bigint
  unloadCnt: bigint
  dt: Date | null
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

  // const totalEntries = records.reduce((sum, r) => sum + r.entryCnt, 0n)
  // const totalExits = records.reduce((sum, r) => sum + r.exitCnt, 0n)
  const totalLoads = records.reduce((sum, r) => sum + r.loadCnt, 0n)
  const totalUnloads = records.reduce((sum, r) => sum + r.unloadCnt, 0n)

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
          {/* <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL VEHICLES</Text>
            <Text style={styles.summaryValue}>{records.length}</Text>
          </View> */}
          {/* <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL ENTRIES</Text>
            <Text style={styles.summaryValue}>{totalEntries}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>TOTAL EXITS</Text>
            <Text style={styles.summaryValue}>{totalExits}</Text>
          </View> */}
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
              <Text style={styles.tableCellValue}>{'Time (In)'}</Text>
            </View>
            <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>{'Time (Out)'}</Text>
            </View>
            {/* <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>Exit Count</Text>
            </View> */}
            <View style={{ ...styles.tableCell, flex: 2, textAlign: 'center' }}>
              <Text style={styles.tableCellValue}>Event Activity (Load/ Unload)</Text>
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
                <View style={{ ...styles.tableCell, flex: 1.5 }}>
                  <Text style={styles.tableCellLabel}>{record.dt ? formatDate(record.dt) : '--'}</Text>
                </View>
                {/* <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.entryCnt}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.exitCnt}</Text>
                </View> */}
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.loadCnt}</Text>
                </View>
                <View style={{ ...styles.tableCell, flex: 1, textAlign: 'center' }}>
                  <Text style={styles.tableCellLabel}>{record.unloadCnt}</Text>
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
