import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { fetchbyCommande } from '../../../api/livraisonService';
import logo from '../../../images/logo1.png';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.6,
    color: '#4a4a4a'
  },
  logo: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 100,
    height: 50
  },
  headerInfo: {
    position: 'absolute',
    top: 30,
    right: 40,
    textAlign: 'right',
    fontSize: 10,
    color: '#666',
  },
  contactDetails: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right'
  },
  header: {
    fontSize: 20,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333'
  },
  text: {
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8'
  },
  tableColHeader: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#dcdcdc',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 5
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlign: 'center',
    padding: 5
  },

  observation: {
    marginTop: 10,
    fontStyle: 'italic'
  },
  signatureSection: {
    marginTop: 30,
    textAlign: 'left',
  },
  signatureLabel: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  signatureLine: {
    fontSize: 12,
    marginTop: 10,
    textDecoration: 'underline',
  },
  signatureImage: {
    marginTop: 10,
    width: 200,
    height: 50,
  }
});

const InvoiceDocument = ({ data }) => {
  const livraison = data[0]; 

  if (!livraison) {
    return null; 
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logo} style={styles.logo} />
        <Text style={styles.header}>Confirmation de la commande N°{livraison.NumeroCommande}</Text>
        <View style={styles.contactDetails}>
          <Text>AGB Transport</Text>
          <Text>test@gmail.com</Text>
          <Text>+123456789</Text>
          <Text>123 Test ., City, Country</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subHeader}>Commande pour:</Text>
          <Text style={styles.text}>{livraison.client?.first_name} {livraison.client?.last_name}</Text>
          <Text style={styles.text}>{livraison.client?.address1}</Text>
          <Text style={styles.text}>{livraison.client?.phone}</Text>
          <Text style={styles.subHeader}>LIVRAISON POUR {livraison.Date}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Article</Text>
            <Text style={styles.tableColHeader}>Qté</Text>
            <Text style={styles.tableColHeader}>Dépose</Text>
            <Text style={styles.tableColHeader}>Montage</Text>
            <Text style={styles.tableColHeader}>Install</Text>
          </View>
          {livraison.products && livraison.products.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCol}>{item.productId?.name}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
              <Text style={styles.tableCol}>{item.Dépôt ? 'Oui' : 'Non'}</Text>
              <Text style={styles.tableCol}>{item.Montage ? 'Oui' : 'Non'}</Text>
              <Text style={styles.tableCol}>{item.Install ? 'Oui' : 'Non'}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.observation}>Observations : {livraison.Observations}</Text>

        {livraison.products && livraison.products.length > 0 && (
          <Text style={styles.text}>Total à payer : {livraison.price}€</Text>
        )}
        <Text style={styles.text}>Solde Magasin : 0€</Text>  {/* to be adjusted for later use */}

        <Text style={styles.signature}>
          Par sa signature, le client reconnaît avoir reçu, contrôlé et constaté
          le bon état de la marchandise livrée et/ou installée ce jour
        </Text>
        <View style={styles.signatureSection}>
          <Text style={styles.signatureLabel}>Signature du client:</Text>
          {livraison?.signature ? (
            <Image src={livraison.signature} style={styles.signatureImage} />
          ) : (
            <Text style={styles.signatureLine}>....................................</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}

const InvoicePDF = () => {
  const { NumeroCommande } = useParams(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const livraisonData = await fetchbyCommande(NumeroCommande);
        setData(livraisonData);
      } catch (error) {
        console.error('Error fetching livraison data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [NumeroCommande]);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(data);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PDFViewer style={{ width: '100%', height: '100%' }}> 
        <InvoiceDocument data={data} />
      </PDFViewer>
    </div>
  );
};

export default InvoicePDF;
