import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { TechDebtItem } from '@shared/schema';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f6f6f6',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 12,
    marginTop: 5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    width: '30%',
  },
  statTitle: {
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

interface TechDebtPDFProps {
  items: TechDebtItem[];
}

export function TechDebtPDF({ items }: TechDebtPDFProps) {
  // Calculate statistics
  const totalItems = items.length;
  const highPriorityItems = items.filter(item => item.priority === 'high').length;
  const inProgressItems = items.filter(item => item.status === 'in_progress').length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Tech Debt Report</Text>
        
        {/* Statistics Section */}
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Total Items</Text>
            <Text style={styles.statValue}>{totalItems}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>High Priority</Text>
            <Text style={styles.statValue}>{highPriorityItems}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>In Progress</Text>
            <Text style={styles.statValue}>{inProgressItems}</Text>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tech Debt Items</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDetail}>Priority: {item.priority}</Text>
              <Text style={styles.itemDetail}>Status: {item.status}</Text>
              <Text style={styles.itemDetail}>Category: {item.category}</Text>
              <Text style={styles.itemDetail}>{item.description}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
