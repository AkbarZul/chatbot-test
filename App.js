import React, {Component} from 'react';
import {View, Text, SafeAreaView, Keyboard, StyleSheet, Image} from 'react-native';
import {GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';

import {dialogflow} from './env';

const avatarBotChat = require('./assets/images/profile.jpg');
const send = require('./assets/images/send.png')

const chatBot = {
  _id: 2,
  name: 'Mr.ChatBot',
  avatar: avatarBotChat,
};

class App extends Component {
  state = {
    keyboardStatus: undefined,
    messages: [
      {
        _id: 3,
        text: `
        1. Siapa Saya ? \n
        2. About Project ? \n
        `,
        createdAt: new Date(),
        user: chatBot,
      },
      {
        _id: 2,
        text: 'Saya Adalah Mr. ChatBot',
        createdAt: new Date(),
        user: chatBot,
      },
      {
        _id: 1,
        text: 'Hi',
        createdAt: new Date(),
        user: chatBot,
      },
    ],
    id: 1,
    name: '',
  };

  componentDidMount() {
    this.keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        this.setState({keyboardStatus: 'Keyboard Shown'});
      },
    );
    this.keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({keyboardStatus: 'Keyboard Hidden'});
      },
    );

    Dialogflow_V2.setConfiguration(
      dialogflow.client_email,
      dialogflow.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflow.project_id,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];

    this.sendBotResponse(text);
  }

  sendBotResponse(text) {
    let msg;
    if (text == 'Terima kasih') {
      msg = {
        _id: this.state.messages.length + 1,
        text: 'Terima kasih\ntelah menggunakan\nchatbot',
        image:
          'https://cdn.pixabay.com/photo/2019/03/21/15/51/chatbot-4071274_1280.jpg',
        createdAt: new Date(),
        user: chatBot,
      };
    } else {
      msg = {
        _id: this.state.messages.length + 1,
        text: `${text}`,
        createdAt: new Date(),
        user: chatBot,
      };
    }

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    let message = messages[0].text;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }
  onQuickReply(quick) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, quick),
    }));
    let message = quick[0].value;

    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error),
    );
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
        <Text style={{fontSize: 24, fontWeight: 'bold'}}>Lenna Chat Bot</Text>
        </View>
        <GiftedChat
          isCustomViewBottom={true}
          alwaysShowSend={true}
          alignTop
          renderSend={props => {
            return (
              <Send {...props}>
                <View style={styles.containerIconSend}>
                  <Image source={send} style={{height: 40, width: 40}} />
                </View>
              </Send>
            );
          }}
          renderInputToolbar={props => {
            return (
              <InputToolbar
                {...props}
                containerStyle={styles.containerInput}
                textInputProps={{
                  style: styles.inputStyle,
                }}
              />
            );
          }}
          messages={this.state.messages}
          onSend={message => this.onSend(message)}
          onQuickReply={quick => this.onQuickReply(quick)}
          user={{_id: 1}}
        />
      </SafeAreaView>
      // <View style={{flex: 1, backgroundColor: '#fff'}}>
      //   <GiftedChat
      //     messages={this.state.messages}
      //     onSend={message => this.onSend(message)}
      //     onQuickReply={quick => this.onQuickReply(quick)}
      //     user={{_id: 1}}
      //   />
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
    width: '100%',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerIconSend: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  containerInput: {
    marginLeft: 15,
    marginRight: 30,
    marginBottom: 10,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  inputStyle: {
    width: '86%',
    height: '100%',
    fontSize: 16,
    color: 'black',
    paddingTop: 6,
    paddingLeft: 16,
    backgroundColor: 'lightblue',
    borderWidth: 2,
    borderRadius: 10,
  },
});
export default App;
