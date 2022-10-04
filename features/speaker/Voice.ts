export interface Voice {
  name: string
  language: string
  displayName: string
  provider: VoiceProvider
}

export enum VoiceProvider {
  Google = 'Google',
  Azure = 'Azure',
  BrowserRemote = 'BrowserRemote',
  BrowserLocal = 'BrowserLocal',
}

export enum VoiceName {
  enGoogleAStandard = 'enGoogleAStandard',
  enGoogleAWavenet = 'enGoogleAWavenet',
  enGoogleBStandard = 'enGoogleBStandard',
  enGoogleBWavenet = 'enGoogleBWavenet',
  enGoogleCStandard = 'enGoogleCStandard',
  enGoogleCWavenet = 'enGoogleCWavenet',
  enGoogleDStandard = 'enGoogleDStandard',
  enGoogleDWavenet = 'enGoogleDWavenet',
  enGoogleEStandard = 'enGoogleEStandard',
  enGoogleEWavenet = 'enGoogleEWavenet',
  enGoogleFStandard = 'enGoogleFStandard',
  enGoogleFWavenet = 'enGoogleFWavenet',
  enGoogleGStandard = 'enGoogleGStandard',
  enGoogleGWavenet = 'enGoogleGWavenet',
  enGoogleHStandard = 'enGoogleHStandard',
  enGoogleHWavenet = 'enGoogleHWavenet',
  enGoogleIStandard = 'enGoogleIStandard',
  enGoogleIWavenet = 'enGoogleIWavenet',
  enGoogleJStandard = 'enGoogleJStandard',
  enGoogleJWavenet = 'enGoogleJWavenet',
}

export const Voices: { [N in VoiceName]: Voice } = {
  enGoogleAStandard: {
    language: 'en-US',
    name: 'en-US-Standard-A',
    displayName: 'Jabal',
    provider: VoiceProvider.Google,
  },
  enGoogleAWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-A',
    displayName: 'Jabal (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleBStandard: {
    language: 'en-US',
    name: 'en-US-Standard-B',
    displayName: 'Chilion',
    provider: VoiceProvider.Google,
  },
  enGoogleBWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-B',
    displayName: 'Chilion (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleCStandard: {
    language: 'en-US',
    name: 'en-US-Standard-C',
    displayName: 'Deborah',
    provider: VoiceProvider.Google,
  },
  enGoogleCWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-C',
    displayName: 'Deborah (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleDStandard: {
    language: 'en-US',
    name: 'en-US-Standard-D',
    displayName: 'Eliakim',
    provider: VoiceProvider.Google,
  },
  enGoogleDWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-D',
    displayName: 'Eliakim (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleEStandard: {
    language: 'en-US',
    name: 'en-US-Standard-E',
    displayName: 'Elisha',
    provider: VoiceProvider.Google,
  },
  enGoogleEWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-E',
    displayName: 'Elisha (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleFStandard: {
    language: 'en-US',
    name: 'en-US-Standard-F',
    displayName: 'Vashti',
    provider: VoiceProvider.Google,
  },
  enGoogleFWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-F',
    displayName: 'Vashti (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleGStandard: {
    language: 'en-US',
    name: 'en-US-Standard-G',
    displayName: 'Leah',
    provider: VoiceProvider.Google,
  },
  enGoogleGWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-G',
    displayName: 'Leah (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleHStandard: {
    language: 'en-US',
    name: 'en-US-Standard-H',
    displayName: 'Orpah',
    provider: VoiceProvider.Google,
  },
  enGoogleHWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-H',
    displayName: 'Orpah (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleIStandard: {
    language: 'en-US',
    name: 'en-US-Standard-I',
    displayName: 'Uriah',
    provider: VoiceProvider.Google,
  },
  enGoogleIWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-I',
    displayName: 'Uriah (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  enGoogleJStandard: {
    language: 'en-US',
    name: 'en-US-Standard-J',
    displayName: 'Zebulun',
    provider: VoiceProvider.Google,
  },
  enGoogleJWavenet: {
    language: 'en-US',
    name: 'en-US-Wavenet-J',
    displayName: 'Zebulun (Crystal AI Voice)',
    provider: VoiceProvider.Google,
  },
  // zhCNLocal: {
  //   name: 'Ting-Ting',
  //   language: 'zh-CN',
  //   provider: VoiceProvider.BrowserLocal,
  // },
  // zhTWLocal: {
  //   name: 'Mei-Jia',
  //   language: 'zh-TW',
  //   provider: VoiceProvider.BrowserLocal,
  // },
  // enLocal: {
  //   name: 'Samantha',
  //   language: 'en-US',
  //   provider: VoiceProvider.BrowserLocal,
  // },
  // zhCNRemote: {
  //   name: 'Google 普通话（中国大陆）',
  //   language: 'zh-CN',
  //   provider: VoiceProvider.BrowserRemote,
  // },
  // zhTWRemote: {
  //   name: 'Google 國語（臺灣）',
  //   language: 'zh-TW',
  //   provider: VoiceProvider.BrowserRemote,
  // },
  // enRemote: {
  //   name: 'Google US English',
  //   language: 'en-US',
  //   provider: VoiceProvider.BrowserRemote,
  // },
}
