import { login, getUserInfo } from '@/api/sys'
import md5 from 'md5'
import { TOKEN } from '@/constant'
// 增加解构removeAllItem
import { setItem, getItem, removeAllItem } from '@/utils/storage'
// 增加 导入路由
import router from '@/router'
import { setTimeStamp } from '@/utils/auth'

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN) || '',
    userInfo: {}
  }),
  mutations: {
    setToken(state, token) {
      state.token = token
      setItem(TOKEN, token)
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    login(context, userInfo) {
      const { username, password } = userInfo
      console.log(md5(password))
      return new Promise((resolve, reject) => {
        login({
          username,
          password: md5(password)
        })
          .then((data) => {
            setTimeStamp()
            resolve(data)
            console.log(data)
            this.commit('user/setToken', data.token)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    async getUserInfo(context) {
      const res = await getUserInfo()
      console.log(res)
      this.commit('user/setUserInfo', res)
      return res
    },
    logout() {
      this.commit('user/setToken', '')
      this.commit('user/setUserInfo', {})
      removeAllItem()
      router.push('/login')
    }
  }
}
