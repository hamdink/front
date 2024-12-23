import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import { fetchByDriverAndDate } from '../../../api/livraisonService';  // Make sure to create this function
import logo from '../../../images/logo1.png';  // Placeholder logo

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Helvetica',
        fontSize: 12,
        lineHeight: 1.6,
        color: '#4a4a4a',
    },
    logo: {
        width: 100, 
        height: 60,
        marginBottom: 10,
        alignSelf: 'flex-end', 
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: 10,
    },
    headerLeft: {
        width: '60%',
    },
    headerRight: {
        width: '40%',
        textAlign: 'right',
    },
    routeDate: {
        fontSize: 14,
        marginBottom: 4,
    },
    companyName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    contactInfo: {
        fontSize: 12,
    },
    driverTitle: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tableContainer: {
        marginTop: 20,
        border: '1px solid #e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    table: {
        display: 'table',
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #e0e0e0',
    },
    tableHeader: {
        backgroundColor: '#f8f8f8',
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
        padding: 8,
        fontSize: 10,
        borderRight: '1px solid #e0e0e0',
        textAlign: 'center',
    },
    lastTableCell: {
        borderRight: 'none',
    },
    magasinCell: {
        flex: 2, 
        padding: 8,
        fontSize: 10,
        borderRight: '1px solid #e0e0e0',
        textAlign: 'center',
    },
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const RouteSheetDocument = ({ data }) => {
    if (!data || data.length === 0) {
        return <Text>No deliveries available for this driver on this date</Text>;
    }

    const driverName = data[0]?.driver ? `${data[0].driver.first_name} ${data[0].driver.last_name}` : 'N/A';
    const formattedDate = formatDate(data[0]?.Date ?? 'N/A');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.routeDate}>Feuille de route : {formattedDate}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Image style={styles.logo} src={logo} />
                        <Text style={styles.companyName}>AGB TRANSPORT</Text>
                        <Text style={styles.contactInfo}>Email: mhatem@agbtransport.fr</Text>
                        <Text style={styles.contactInfo}>Phone: +33 6 21 40 10 47</Text>
                        <Text style={styles.contactInfo}>Numéro TVA: FR95897844379</Text>
                    </View>
                </View>

                <Text style={styles.driverTitle}>Nom du chauffeur: {driverName}</Text>

                <View style={styles.tableContainer}>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.magasinCell}>Magasin</Text>
                            <Text style={styles.tableCell}>Client Référence</Text>
                            <Text style={styles.tableCell}>Observations</Text>
                            <Text style={styles.tableCell}>Chq</Text>
                            <Text style={styles.tableCell}>Esp</Text>
                            <Text style={styles.tableCell}>Aut</Text>
                            <Text style={styles.tableCell}>A Fact</Text>
                            <Text style={styles.tableCell}>Fact Sup</Text>
                            <Text style={[styles.tableCell, styles.lastTableCell]}>Cde Fact</Text>
                        </View>

                        {data.map((delivery, index) => (
                            <View style={styles.tableRow} key={index}>
                                <Text style={styles.magasinCell}>
                                    {delivery.market ? delivery.market.first_name : 'N/A'}
                                    {'\n'}Ref: {delivery.reference}
                                    {'\n'}Dist: {Math.ceil(delivery.distance)} Km
                                </Text>
                                <Text style={styles.tableCell}>{delivery.client.first_name} {delivery.client.last_name}</Text>
                                <Text style={styles.tableCell}>{delivery.Observations}</Text>
                                <Text style={styles.tableCell}></Text> {/* Empty columns for checkmarks */}
                                <Text style={styles.tableCell}></Text>
                                <Text style={styles.tableCell}></Text>
                                <Text style={styles.tableCell}></Text>
                                <Text style={styles.tableCell}></Text>
                                <Text style={[styles.tableCell, styles.lastTableCell]}></Text>
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

const RouteSheetPDF = () => {
    const { driverId, date } = useParams();  
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching data for driver ID:', driverId, 'and date:', date);
                const deliveryData = await fetchByDriverAndDate(driverId, date);  
                console.log('Fetched data:', deliveryData);
                setData(deliveryData);
            } catch (error) {
                console.error('Error fetching delivery data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [driverId, date]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div>No delivery data found for this driver on this date</div>;
    }

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <RouteSheetDocument data={data} />
            </PDFViewer>
        </div>
    );
};

export default RouteSheetPDF;
