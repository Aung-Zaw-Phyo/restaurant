import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from "./../../../assets/logo.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
    paddingTop: 35,
    paddingLeft: 35,
    paddingRight: 35,
    paddingBottom: 65,
  },
  logoContainer: {
    textAlign: 'center',
    flexDirection: "row",
    justifyContent: 'center',
    marginBottom: '10px'
  },
  logo: {
    width: 80,
  },  
  address: {
    textAlign: 'center'
  },
  address1: {
    marginBottom: 10
  },
  itemsContainer: {
    marginTop: 20,
    borderBottom: "1px dotted black",
  },
  item: {
    width: "100%",
    flexDirection: "row",
  },
  headerCell: {
    width: "25%",
    padding: "10px",
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  cell: {
    width: "25%",
    padding: "10px",
  },
  footerCell: {
    width: "25%",
    padding: "10px",
    fontWeight: "bold",
  },
  footer: {
    padding: "10px",
    marginTop: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },
});

// Create Document Component
const MyDocument = (props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} src={logo}></Image>
      </View>
      <View style={styles.address}>
        <Text style={styles.address1}>NO - 123, Kyan Sit Thar Road</Text>
        <Text style={styles.address2}>Hlaing Tharyar, Yangon</Text>
      </View>
      <View style={styles.itemsContainer}>
        <View style={styles.item}>
          <View style={styles.headerCell}>
            <Text>Menu</Text>
          </View>
          <View style={styles.headerCell}>
            <Text>Price</Text>
          </View>
          <View style={styles.headerCell}>
            <Text>Quantity</Text>
          </View>
          <View style={styles.headerCell}>
            <Text>Sub Total</Text>
          </View>
        </View>
        {props.orders.map((order) => (
          <View style={styles.item}>
            <View style={styles.cell}>
              <Text>{order.name}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{order.price}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{order.quantity + order.add_quantity}</Text>
            </View>
            <View style={styles.cell}>
              <Text>{order.total_price}</Text>
            </View>
          </View>
        ))}
        <View style={styles.item}>
          <View style={styles.footerCell}>
            <Text>Total Cost</Text>
          </View>
          <View style={styles.footerCell}>
            <Text></Text>
          </View>
          <View style={styles.footerCell}>
            <Text></Text>
          </View>
          <View style={styles.footerCell}>
            <Text>{props.totalCost} (MMK)</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>Thanks you So Much.</Text>
      </View>
    </Page>
  </Document>
);

export default MyDocument;

{
  /* <table className="table table-bordered">
<thead>
  <tr>
    <th scope="col">Name</th>
    <th scope="col">
      Price <small>(MMK)</small>
    </th>
    <th scope="col">Quantity</th>
    <th scope="col">
      Tol Price <small>(MMK)</small>
    </th>
  </tr>
</thead>
<tbody>
  {props.orders.map((order, index) => (
    <tr key={index}>
      <td>{order.name}</td>
      <td>{order.price}</td>
      <td>
        <span>
          {order.quantity + order.add_quantity}
        </span>
      </td>
      <td>{order.total_price}</td>
    </tr>
  ))}

  <tr>
    <td colSpan="2" className="fw-bold">
      Total Cost
    </td>
    <td colSpan="2" className="fw-bold">
      {props.totalCost} <small>MMK</small>
    </td>
  </tr>
</tbody>
</table> */
}
