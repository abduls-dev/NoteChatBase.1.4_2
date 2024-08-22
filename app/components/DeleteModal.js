import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DeleteModal = ({ visible, onClose, onDelete, Message="Are you sure you want to delete all notes?" }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>{Message}</Text>
          <View style={styles.buttonContainer}>

            <TouchableOpacity style={[styles.Button]} onPress={onDelete}>
              <Text style={[styles.buttonText, {color:'#ef5e60'}]}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.Button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 25,
    margin:20,
    padding: 20,
    alignItems: 'center',
    elevation: 5, // shadow on Android
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },

  Button: {
    // backgroundColor: "#f4f4f4",
    // padding:5,
    // paddingHorizontal:15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal:20
  },
  
  buttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default DeleteModal;
