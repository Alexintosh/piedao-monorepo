// scenario for 10/2021
const votes_window_1 = [
  // alice
  {
    "id": "0x15f4946b633f3164d93a2d5a95484b14f438616381ba81787407ff7c5375399f",
    "voter": "0x3c341129dac2096b88945a8985f0ada799abf8c9",
    "created": 1634291930,
    "vp": 0,
    "proposal": {
      "id": "QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "created": 1634291930,
      "state": "active",
      "snapshot": "13335955",
      "title": "Donate",
      "link": "https://snapshot.org/#/piedao.eth/proposal/QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "choices": [
        "OK!",
        "NO! THX!"
      ]
    },
    "choice": 1,
    "space": {
      "id": "piedao.eth"
    }
  },
  // mark
  {
    "id": "0x15f4946b633f3164d93a2d5a95484b14f438616381ba81787407ff7c5375399f",
    "voter": "0x42556f667dfc74704914f98d1e0c0ac4ea2f492e",
    "created": 1634291930,
    "vp": 0,
    "proposal": {
      "id": "QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "created": 1634291930,
      "state": "active",
      "snapshot": "13335955",
      "title": "Donate",
      "link": "https://snapshot.org/#/piedao.eth/proposal/QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "choices": [
        "OK!",
        "NO! THX!"
      ]
    },
    "choice": 1,
    "space": {
      "id": "piedao.eth"
    }
  },
  // paul
  {
    "id": "0x15f4946b633f3164d93a2d5a95484b14f438616381ba81787407ff7c5375399f",
    "voter": "0xabf26352aadaaa1cabffb3a55e378bac6bf15791",
    "created": 1634291930,
    "vp": 0,
    "proposal": {
      "id": "QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "created": 1634291930,
      "state": "active",
      "snapshot": "13335955",
      "title": "Donate",
      "link": "https://snapshot.org/#/piedao.eth/proposal/QmWnu4hqF2x5uyydWGSXzBmLEiVivXZWLLsh1DHFpjEeQC",
      "choices": [
        "OK!",
        "NO! THX!"
      ]
    },
    "choice": 1,
    "space": {
      "id": "piedao.eth"
    }
  } 
];

export const VotesStub1 = (): Array<any> => {
  return votes_window_1;
}