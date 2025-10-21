import React, { useState, useEffect, useContext } from 'react';
import { 
  View, TextInput, Button, FlatList, Text, StyleSheet, 
  TouchableOpacity, Alert, Image, Modal 
} from 'react-native';
import { collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { AuthContext } from '../context/AuthContext';

export default function ListaScreen() {
  const { user, logout } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'productos'), (snapshot) => {
      setProductos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const limpiarCampos = () => {
    setNombre('');
    setPrecio('');
    setCantidad('');
    setEditandoId(null);
  };

  const abrirModalAgregar = () => {
    limpiarCampos();
    setModalVisible(true);
  };

  const abrirModalEditar = (producto) => {
    setEditandoId(producto.id);
    setNombre(producto.nombre);
    setPrecio(producto.precio.toString());
    setCantidad(producto.cantidad.toString());
    setModalVisible(true);
  };

  const cerrarModal = () => {
    limpiarCampos();
    setModalVisible(false);
  };

  const confirmarAccion = async () => {
    if (!nombre || !precio || !cantidad) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (editandoId) {
      await updateDoc(doc(db, 'productos', editandoId), {
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
      });
    } else {
      await addDoc(collection(db, 'productos'), {
        nombre,
        precio: parseFloat(precio),
        cantidad: parseInt(cantidad),
        uid: user.uid,
      });
    }

    cerrarModal();
  };

  const eliminarProducto = async (id) => {
    Alert.alert(
      'Eliminar Producto',
      '¿Estás seguro de eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await deleteDoc(doc(db, 'productos', id));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gestión de Productos 📦</Text>

      <Button title="Agregar producto" onPress={abrirModalAgregar} />

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        ListHeaderComponent={
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerCell, styles.nameCell]}>Nombre</Text>
            <Text style={[styles.cell, styles.headerCell, styles.priceCell]}>Precio</Text>
            <Text style={[styles.cell, styles.headerCell, styles.quantityCell]}>Cantidad</Text>
            <Text style={[styles.cell, styles.headerCell, styles.editCell]}>Editar</Text>
            <Text style={[styles.cell, styles.headerCell, styles.deleteCell]}>Eliminar</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.cell, styles.nameCell]} numberOfLines={1}>{item.nombre}</Text>
            <Text style={[styles.cell, styles.priceCell]}>${item.precio}</Text>
            <Text style={[styles.cell, styles.quantityCell]}>{item.cantidad}</Text>
            
            {/* Columna Editar */}
            <View style={[styles.cell, styles.editCell]}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => abrirModalEditar(item)}
              >
                <Image
                  source={require('../../assets/Lapiz.png')}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            {/* Columna Eliminar */}
            <View style={[styles.cell, styles.deleteCell]}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => eliminarProducto(item.id)}
              >
                <Text style={styles.btnText}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.logoutButtonContainer}>
        <Button title="Cerrar sesión" onPress={logout} color="red" />
      </View>

      {/* Modal de agregar / editar */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={cerrarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editandoId ? 'Editar producto ✏️' : 'Agregar producto ➕'}
            </Text>

            <Text>
              Nombre:
            </Text>
            <TextInput
              placeholder="Nombre del producto"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />

            <Text>
              Precio:
            </Text>
            <TextInput
              placeholder="Precio"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text>
              Cantidad:
            </Text>
            <TextInput
              placeholder="Cantidad"
              value={cantidad}
              onChangeText={setCantidad}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={cerrarModal} color="#6c757d" />
              <Button
                title={editandoId ? 'Guardar cambios' : 'Confirmar'}
                onPress={confirmarAccion}
                color="#007bff"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 10, fontSize: 16,
  },
  flatList: { marginTop: 15 },
  tableHeader: {
    flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#333',
    paddingVertical: 12, backgroundColor: '#f8f9fa',
  },
  tableRow: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e9ecef',
    paddingVertical: 10, alignItems: 'center',
  },
  cell: { paddingHorizontal: 2, justifyContent: 'center', alignItems: 'center' },
  headerCell: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  nameCell: { flex: 2, textAlign: 'left' },
  priceCell: { flex: 1, textAlign: 'center' },
  quantityCell: { flex: 1, textAlign: 'center' },
  editCell: { flex: 1 },
  deleteCell: { flex: 1 },
  editBtn: {
    paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6,
    backgroundColor: '#4d9affff', alignItems: 'center', justifyContent: 'center', minWidth: 36,
  },
  deleteBtn: {
    paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6,
    backgroundColor: '#dc3545', alignItems: 'center', justifyContent: 'center', minWidth: 36,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  
  // 🔹 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  logoutButtonContainer: {
    position: 'relative',
    top: -40,
    right: 0,
    zIndex: 10,
  },
});