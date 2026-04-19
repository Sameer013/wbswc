'use client'

// import { get } from 'http'

import React from 'react'

import { Document, Page, Text, View, Image } from '@react-pdf/renderer'

import { styles } from './styles/vehicleReport'
import type { EventSummaryRecord2 } from '@/components/reports/VehicleSummaryReport'

// import { getVehicleImage } from '@/app/server/action'

// import { getVehicleImage } from '@/app/server/action'

export type EventRecord = EventSummaryRecord2

const formatDate = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`

const formatTime = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`

const VehicleReport = ({ record }: { record: EventRecord }) => {
  const generatedAt = new Date()
  const entryImg = record.entry_image || ''
  const exitImg = record.exit_image || ''

  return (
    <Document title={`Vehicle Event #${String(record.id).padStart(6, '0')} Report`} producer='sigma' author='WBSWC'>
      <Page size='A4' style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Image style={styles.logoIcon} src={'/images/logo1.png'} />
            <Image style={styles.logoText} src={'/images/logo2.png'} />
          </View>
          <View>
            <Text style={styles.reportLabel}>VEHICLE EVENT REPORT</Text>
            <Text style={styles.reportId}>#{String(record.id).padStart(6, '0')}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryBand}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>EVENT DATE</Text>
            <Text style={styles.summaryValue}>{formatDate(new Date(record.event_date))}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ENTRY TIME</Text>
            <Text style={styles.summaryValue}>{record.entry_time ? `${record.entry_time}` : '--'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>EXIT TIME</Text>
            <Text style={styles.summaryValue}>{record.exit_time ? `${record.exit_time}` : '--'}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>VEHICLE NO.</Text>
            <Text style={styles.summaryValue}>{record.vehicleNo}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>NET WEIGHT (KG)</Text>
            <Text style={styles.summaryValue}>{record.net_wt ? `${record.net_wt}` : '--'}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>EVENT DETAILS</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableRowAlt]}>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Event ID</Text>
              <Text style={styles.tableCellValue}>#{record.id}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Tare Weight</Text>
              <Text style={styles.tableCellValue}>{record.tare_wt ? `${record.tare_wt} KG` : '--'}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Tare Weight Time</Text>
              <Text style={styles.tableCellValue}>{record.tare_wt_time ? `${record.tare_wt_time}` : '--'}</Text>
            </View>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Vehicle Number</Text>
              <Text style={styles.tableCellValue}>{record.vehicleNo}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Gross Weight</Text>
              <Text style={styles.tableCellValue}>{record.gross_wt ? `${record.gross_wt} KG` : '--'}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableCellLabel}>Gross Weight Time</Text>
              <Text style={styles.tableCellValue}>{record.gross_wt_time ? `${record.gross_wt_time}` : '--'}</Text>
            </View>
          </View>
        </View>

        {/* <Text style={styles.sectionTitle}>STATUS</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PROCESSED</Text>
          </View>
        </View> */}

        <Text style={styles.sectionTitle}>VEHICLE IMAGES</Text>
        <View style={styles.imageRow}>
          <View style={styles.imageBox}>
            <Text style={styles.imageLabel}>ENTRY</Text>
            {entryImg ? (
              <Image style={styles.vehicleImage} src={entryImg} />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>No Image Available</Text>
              </View>
            )}
          </View>
          {/* </View>
        <View style={styles.imageRow}> */}
          <View style={styles.imageBox}>
            <Text style={styles.imageLabel}>EXIT</Text>
            {exitImg ? (
              <Image style={styles.vehicleImage} src={exitImg} />
            ) : (
              <View style={styles.noImage}>
                <Text style={styles.noImageText}>No Image Available</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.notesBox}>
          <Text style={styles.notesLabel}>REMARKS</Text>
          <Text style={styles.notesText}>
            This document serves as an official weighbridge record for vehicle {record.vehicleNo}. The recorded weight
            and timestamps are captured automatically by the ANPR system.
          </Text>
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

export default VehicleReport
