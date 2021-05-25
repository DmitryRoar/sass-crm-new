class HttpImport {
  constructor(selector, options) {
    this.selector = document.querySelector(selector)
    this.options = options
    this.#render()
  }

  #render() {
    this.#getToken()
    this.getFile()
  }

  #getTemplate({url = '', user = '', error = '', message = ''}) {
    let $wrap = ``

    if (url) {
      $wrap = `
      <div id="result">
        <ul>
          <li>url: <strong>${url}</strong></li>
          <li>user: <strong>${user}</strong></li>
        </ul>
      </div>
      `
    } else {
      $wrap = `
      <div id="result">
        <ul>
          <li>error: ${error || message}</li>
        </ul>
      </div>
      `
    }
    document.querySelector('#result-wrap').innerHTML = $wrap
  }

  async getFile() {
    const token = localStorage.getItem('user-token')
    const res = await this.#request(
      'https://izibabyshop.com.ua/api/import-seller-url',
      {
        method: 'POST',
        body: {url: this.selector.value},
        headers: {Authorization: `Bearer ${token}`}
      }
    )
    const data = await res.json()
    console.log(data)
    this.#getTemplate(data)
  }

  async #request(url, {method, body, headers = {}}) {
    try {
      return await fetch(url, {
        method,
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json', ...headers}
      })
    } catch (e) {
      console.log(e)
    }
  }

  async #getToken() {
    const {email, password} = this.options.authImputs
    const res = await this.#request('https://izibabyshop.com.ua/api/login_check', {
      method: 'POST',
      body: {email, password}
    })
    const data = await res.json()
    localStorage.setItem('user-token', data.token)
  }
}

const importFromServer = new HttpImport('#search-request', {
  authImputs: {
    email: 'anton@test.com',
    password: '3547'
  }
})