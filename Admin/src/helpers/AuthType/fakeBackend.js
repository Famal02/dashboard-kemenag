// import axios from "axios"
import { axiosApi as axios } from "../api_helper"
import MockAdapter from "axios-mock-adapter"
import * as url from "../url_helper"
import accessToken from "../jwt-token-access/accessToken"
import {
  calenderDefaultCategories,
  chats,
  contacts,
  cryptoOrders,
  events,
  groups,
  invoiceList,
  messages,
  projects,
  inboxmails,
  starredmails,
  importantmails,
  draftmails,
  sentmails,
  trashmails,
  tasks,
  userProfile,
  users as members,
  wallet,
  janTopSellingData,
  decTopSellingData,
  novTopSellingData,
  octTopSellingData,
  janEarningData,
  decEarningData,
  novEarningData,
  octEarningData,
  MarketOverViewAllData, MarketOver1MData, MarketOver6MData, MarketOver1YData,
  PieChart1YData, PieChart6MData, PieChart1MData, PieChartAllData, InvestedOverviewMay, InvestedOverviewApril, InvestedOverviewMarch,
  InvestedOverviewFeb, InvestedOverviewJan, InvestedOverviewDec
} from "../../common/data"

let users = [
  {
    uid: 1,
    username: "admin",
    role: "admin",
    password: "123456",
    email: "admin@themesbrand.com",
  },
]

const fakeBackend = () => {
  // This sets the mock adapter on the default instance
  const mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

  mock.onPost(url.POST_FAKE_REGISTER).reply(config => {
    const user = JSON.parse(config["data"])
    users.push(user)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user])
      })
    })
  })

  mock.onPost("/post-fake-login").reply(config => {
    const user = JSON.parse(config["data"])
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    )

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          resolve([200, validUser[0]])
        } else {
          reject([
            "Username and password are invalid. Please enter correct username and password",
          ])
        }
      })
    })
  })

  mock.onPost("/fake-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."])
      })
    })
  })

  mock.onPost("/post-jwt-register").reply(config => {
    const user = JSON.parse(config["data"])
    users.push(user)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, user])
      })
    })
  })

  mock.onPost("/post-jwt-login").reply(config => {
    const user = JSON.parse(config["data"])
    const validUser = users.filter(
      usr => usr.email === user.email && usr.password === user.password
    )

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken

          // JWT AccessToken
          const tokenObj = { accessToken: token } // Token Obj
          const validUserObj = { ...validUser[0], ...tokenObj } // validUser Obj

          resolve([200, validUserObj])
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ])
        }
      })
    })
  })

  mock.onPost("/post-jwt-profile").reply(config => {
    const user = JSON.parse(config["data"])

    const one = config.headers

    let finalToken = one.Authorization

    const validUser = users.filter(usr => usr.uid === user.idx)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verify Jwt token from header.Authorization
        if (finalToken === accessToken) {
          if (validUser["length"] === 1) {
            let objIndex

            //Find index of specific object using findIndex method.
            objIndex = users.findIndex(obj => obj.uid === user.idx)

            //Update object's name property.
            users[objIndex].username = user.username

            // Assign a value to locastorage
            localStorage.removeItem("authUser")
            localStorage.setItem("authUser", JSON.stringify(users[objIndex]))

            resolve([200, "Profile Updated Successfully"])
          } else {
            reject([400, "Something wrong for edit profile"])
          }
        } else {
          reject([400, "Invalid Token !!"])
        }
      })
    })
  })

  mock.onPost("/post-fake-profile").reply(config => {
    const user = JSON.parse(config["data"])

    const validUser = users.filter(usr => usr.uid === user.idx)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (validUser["length"] === 1) {
          let objIndex

          //Find index of specific object using findIndex method.
          objIndex = users.findIndex(obj => obj.uid === user.idx)

          //Update object's name property.
          users[objIndex].username = user.username

          // Assign a value to locastorage
          localStorage.removeItem("authUser")
          localStorage.setItem("authUser", JSON.stringify(users[objIndex]))

          resolve([200, "Profile Updated Successfully"])
        } else {
          reject([400, "Something wrong for edit profile"])
        }
      })
    })
  })

  mock.onPost("/jwt-forget-pwd").reply(config => {
    // User needs to check that user is eXist or not and send mail for Reset New password

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "Check you mail and reset your password."])
      })
    })
  })

  mock.onPost("/social-login").reply(config => {
    const user = JSON.parse(config["data"])

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.token) {
          // You have to generate AccessToken by jwt. but this is fakeBackend so, right now its dummy
          const token = accessToken

          // JWT AccessToken
          const tokenObj = { accessToken: token } // Token Obj
          const validUserObj = { ...user[0], ...tokenObj } // validUser Obj

          resolve([200, validUserObj])
        } else {
          reject([
            400,
            "Username and password are invalid. Please enter correct username and password",
          ])
        }
      })
    })
  })


  mock.onGet(url.GET_EVENTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (events) {
          // Passing fake JSON data as response
          resolve([200, events])
        } else {
          reject([400, "Cannot get events"])
        }
      })
    })
  })

  mock.onGet(url.GET_INBOX_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (inboxmails) {
          // Passing fake JSON data as response
          resolve([200, inboxmails])
        } else {
          reject([400, "Cannot get inboxmails"])
        }
      })
    })
  })

  mock.onPost(url.ADD_NEW_INBOX_MAIL).reply(inboxmail => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (inboxmail && inboxmail.data) {
          // Passing fake JSON data as response
          resolve([200, inboxmail.data])
        } else {
          reject([400, "Cannot add project"])
        }
      })
    })
  })

  mock.onDelete(url.DELETE_INBOX_MAIL).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.inboxmail])
        } else {
          reject([400, "Cannot delete inboxmail"])
        }
      })
    })
  })

  mock.onGet(url.GET_STARRED_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (starredmails) {
          // Passing fake JSON data as response
          resolve([200, starredmails])
        } else {
          reject([400, "Cannot get starredmails"])
        }
      })
    })
  })

  mock.onGet(url.GET_IMPORTANT_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (importantmails) {
          // Passing fake JSON data as response
          resolve([200, importantmails])
        } else {
          reject([400, "Cannot get importantmails"])
        }
      })
    })
  })
  mock.onGet(url.GET_TRASH_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (trashmails) {
          // Passing fake JSON data as response
          resolve([200, trashmails])
        } else {
          reject([400, "Cannot get trashmails"])
        }
      })
    })
  })
  mock.onGet(url.GET_DRAFT_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (draftmails) {
          // Passing fake JSON data as response
          resolve([200, draftmails])
        } else {
          reject([400, "Cannot get draftmails"])
        }
      })
    })
  })
  mock.onGet(url.GET_SENT_MAILS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (sentmails) {
          // Passing fake JSON data as response
          resolve([200, sentmails])
        } else {
          reject([400, "Cannot get sentmails"])
        }
      })
    })
  })

  mock.onPost(url.ADD_NEW_USER).reply(user => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.data) {
          // Passing fake JSON data as response
          resolve([200, user.data])
        } else {
          reject([400, "Cannot add user"])
        }
      })
    })
  })

  mock.onPut(url.UPDATE_USER).reply(user => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (user && user.data) {
          // Passing fake JSON data as response
          resolve([200, user.data])
        } else {
          reject([400, "Cannot update user"])
        }
      })
    })
  })

  mock.onDelete(url.DELETE_USER).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.user])
        } else {
          reject([400, "Cannot delete user"])
        }
      })
    })
  })

  mock.onPost(url.ADD_NEW_PROJECT).reply(project => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (project && project.data) {
          // Passing fake JSON data as response
          resolve([200, project.data])
        } else {
          reject([400, "Cannot add project"])
        }
      })
    })
  })

  mock.onPut(url.UPDATE_PROJECT).reply(project => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (project && project.data) {
          // Passing fake JSON data as response
          resolve([200, project.data])
        } else {
          reject([400, "Cannot update project"])
        }
      })
    })
  })

  mock.onDelete(url.DELETE_PROJECT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.project])
        } else {
          reject([400, "Cannot delete project"])
        }
      })
    })
  })

  mock.onPost(url.ADD_NEW_EVENT).reply(event => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data])
        } else {
          reject([400, "Cannot add event"])
        }
      })
    })
  })

  mock.onPut(url.UPDATE_EVENT).reply(event => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data])
        } else {
          reject([400, "Cannot update event"])
        }
      })
    })
  })

  mock.onDelete(url.DELETE_EVENT).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.event])
        } else {
          reject([400, "Cannot delete event"])
        }
      })
    })
  })

  mock.onGet(url.GET_CATEGORIES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (calenderDefaultCategories) {
          // Passing fake JSON data as response
          resolve([200, calenderDefaultCategories])
        } else {
          reject([400, "Cannot get categories"])
        }
      })
    })
  })

  mock.onGet(url.GET_CHATS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (chats) {
          // Passing fake JSON data as response
          resolve([200, chats])
        } else {
          reject([400, "Cannot get chats"])
        }
      })
    })
  })

  mock.onGet(url.GET_GROUPS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (groups) {
          // Passing fake JSON data as response
          resolve([200, groups])
        } else {
          reject([400, "Cannot get groups"])
        }
      })
    })
  })

  mock.onGet(url.GET_CONTACTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (contacts) {
          // Passing fake JSON data as response
          resolve([200, contacts])
        } else {
          reject([400, "Cannot get contacts"])
        }
      })
    })
  })

  mock.onGet(new RegExp(`${url.GET_MESSAGES}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (messages) {
          // Passing fake JSON data as response
          const { params } = config
          const filteredMessages = messages.filter(
            msg => msg.roomId === params.roomId
          )
          resolve([200, filteredMessages])
        } else {
          reject([400, "Cannot get messages"])
        }
      })
    })
  })

  mock.onPost(url.ADD_MESSAGE).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config.data) {
          // Passing fake JSON data as response
          resolve([200, config.data])
        } else {
          reject([400, "Cannot add message"])
        }
      })
    })
  })

  mock.onGet(url.GET_WALLET).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (wallet) {
          // Passing fake JSON data as response
          resolve([200, wallet])
        } else {
          reject([400, "Cannot get wallet data"])
        }
      })
    })
  })

  mock.onGet(url.GET_CRYPTO_ORDERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cryptoOrders) {
          // Passing fake JSON data as response
          resolve([200, cryptoOrders])
        } else {
          reject([400, "Cannot get orders"])
        }
      })
    })
  })

  mock.onGet(url.GET_PROJECTS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (projects) {
          // Passing fake JSON data as response
          resolve([200, projects])
        } else {
          reject([400, "Cannot get projects"])
        }
      })
    })
  })

  mock.onGet(new RegExp(`${url.GET_PROJECT_DETAIL}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (projects) {
          // Passing fake JSON data as response
          const { params } = config
          const project = projects.find(
            project => project.id.toString() === params.id.toString()
          )
          resolve([200, project])
        } else {
          reject([400, "Cannot get project detail"])
        }
      })
    })
  })

  mock.onGet(url.GET_TASKS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (tasks) {
          // Passing fake JSON data as response
          resolve([200, tasks])
        } else {
          reject([400, "Cannot get tasks"])
        }
      })
    })
  })

  mock.onGet(url.GET_USERS).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (members) {
          // Passing fake JSON data as response
          resolve([200, members])
        } else {
          reject([400, "Cannot get users"])
        }
      })
    })
  })

  mock.onGet(url.GET_USER_PROFILE).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userProfile) {
          // Passing fake JSON data as response
          resolve([200, userProfile])
        } else {
          reject([400, "Cannot get user profile"])
        }
      })
    })
  })

  mock.onGet(new RegExp(`${url.TOP_SELLING_DATA}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      const { params } = config
      setTimeout(() => {
        if (params && params.month) {
          // Passing fake JSON data as response

          var data = []
          if (params.month === "jan") {
            data = janTopSellingData
          } else if (params.month === "dec") {
            data = decTopSellingData
          } else if (params.month === "nov") {
            data = novTopSellingData
          } else if (params.month === "oct") {
            data = octTopSellingData
          }
          resolve([200, data])
        } else {
          reject([400, "Cannot get selling data"])
        }
      })
    })
  })

  mock.onGet(new RegExp(`${url.GET_EARNING_DATA}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      const { params } = config
      setTimeout(() => {
        if (params && params.month) {
          // Passing fake JSON data as response
          const { params } = config
          var data = []
          if (params.month === "jan") {
            data = janEarningData
          } else if (params.month === "dec") {
            data = decEarningData
          } else if (params.month === "nov") {
            data = novEarningData
          } else if (params.month === "oct") {
            data = octEarningData
          }
          resolve([200, data])
        } else {
          reject([400, "Cannot get earning data"])
        }
      })
    })
  })
  mock.onGet(new RegExp(`${url.GET_MARKET_OVERVIEW}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      const { params } = config
      setTimeout(() => {
        if (params && params.periodType) {
          // Passing fake JSON data as response

          var data = [];
          if (params.periodType === "6M") {
            data = MarketOver6MData;
          } else if (params.periodType === "1M") {
            data = MarketOver1MData;
          } else if (params.periodType === "1Y") {
            data = MarketOver1YData;
          } else if (params.periodType === "ALL") {
            data = MarketOverViewAllData;
          }
          resolve([200, data]);
        } else {
          reject([400, "Cannot get selling data"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_WALLENT_BALANCE}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      const { params } = config
      setTimeout(() => {
        if (params && params.data) {
          // Passing fake JSON data as response

          var data = [];
          if (params.data === "6M") {
            data = PieChart6MData;
          }
          else if (params.data === "1M") {
            data = PieChart1MData;
          } else if (params.data === "1Y") {
            data = PieChart1YData;
          } else if (params.data === "ALL") {
            data = PieChartAllData;
          }
          resolve([200, data]);
        } else {
          reject([400, "Cannot get selling data"]);
        }
      });
    });
  });

  mock.onGet(new RegExp(`${url.GET_Invested_Overview}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      const { params } = config
      setTimeout(() => {
        if (params && params.data) {
          // Passing fake JSON data as response

          var data = [];
          if (params.data === "AP") {
            data = InvestedOverviewApril;
          }
          else if (params.data === "MA") {
            data = InvestedOverviewMarch;
          } else if (params.data === "FE") {
            data = InvestedOverviewFeb;
          } else if (params.data === "JA") {
            data = InvestedOverviewJan;
          }
          else if (params.data === "DE") {
            data = InvestedOverviewDec;
          }
          resolve([200, data]);
        } else {
          reject([400, "Cannot get selling data"]);
        }
      });
    });
  });

  //DashBoard Invoice CRUD

  mock.onDelete(url.DELETE_INVOICE).reply((config) => {
    console.log("config", config)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (config && config.headers) {
          // Passing fake JSON data as response
          resolve([200, config.headers.data])
        } else {
          reject([400, "Cannot delete user"])
        }
      })
    })
  })

  mock.onPut(url.UPDATE_INVOICE).reply(event => {
    console.log("event", event.data)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (event && event.data) {
          // Passing fake JSON data as response
          resolve([200, event.data])
        } else {
          reject([400, "Cannot update event"])
        }
      })
    })
  })

  mock.onPost(url.ADD_INVOICE).reply(data => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data && data.data) {
          // Passing fake JSON data as response
          resolve([200, data.data])
        } else {
          reject([400, "Cannot add user"])
        }
      })
    })
  })

  mock.onGet(url.GET_INVOICES).reply(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (invoiceList) {
          // Passing fake JSON data as response
          resolve([200, invoiceList])
        } else {
          reject([400, "Cannot get invoices"])
        }
      })
    })
  })

  mock.onGet(new RegExp(`${url.GET_INVOICE_DETAIL}/*`)).reply(config => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (invoiceList) {
          // Passing fake JSON data as response
          const { params } = config
          const invoice = invoiceList.find(
            invoice => invoice.id.toString() === params.id.toString()
          )
          resolve([200, invoice])
        } else {
          reject([400, "Cannot get invoice"])
        }
      })
    })
  })

  // --- WAKAF MOCK DATA ---
  mock.onGet(new RegExp(url.GET_WAKAF_MAP_DATA + ".*")).reply(config => {
    // Mock Data per Province ID (Green Map)
    const data = {
      "ID-AC": 450, "ID-SU": 320, "ID-SB": 210, "ID-RI": 180, "ID-JA": 150, "ID-SS": 280, "ID-BE": 90, "ID-LA": 310, "ID-BB": 120, "ID-KR": 140,
      "ID-JK": 400, "ID-JB": 850, "ID-JT": 720, "ID-YO": 180, "ID-JI": 690, "ID-BT": 350, "ID-BA": 220, "ID-NB": 150, "ID-NT": 170,
      "ID-KB": 210, "ID-KT": 190, "ID-KS": 160, "ID-KI": 230, "ID-KU": 80, "ID-SA": 120, "ID-ST": 140, "ID-SN": 310, "ID-SG": 110,
      "ID-GO": 70, "ID-SR": 90, "ID-MA": 100, "ID-MU": 80, "ID-PB": 90, "ID-PA": 150
    };
    return [200, data];
  });

  mock.onGet(new RegExp(url.GET_WAKAF_DETAILS + ".*")).reply(config => {
    // Mock Details List
    const details = [
      { id: 1, loc: "Masjid Raya Al-Falah", area: "1,200 m2", wakif: "H. Abdullah", nazhir: "Yayasan Amanah", benefit: "Masjid" },
      { id: 2, loc: "Tanah Kosong Jl. Merdeka", area: "500 m2", wakif: "Hj. Siti", nazhir: "KUA Setempat", benefit: "Sosial" },
      { id: 3, loc: "Sekolah Islam Terpadu", area: "2,500 m2", wakif: "Keluarga Besar X", nazhir: "Yayasan Pendidikan", benefit: "Pendidikan" },
      { id: 4, loc: "Klinik Pratama", area: "800 m2", wakif: "H. Fulan", nazhir: "Dompet Dhuafa", benefit: "Kesehatan" },
      { id: 5, loc: "Lahan Produktif Sawit", area: "5 Ha", wakif: "PT. Sawit Jaya", nazhir: "BWI Pusat", benefit: "Ekonomi" },
    ];
    return [200, details];
  });

  // --- RUMAH IBADAH MOCK DATA ---
  mock.onGet(new RegExp(url.GET_WORSHIP_SUMMARY + ".*")).reply(config => {
    return [200, {
      total_national: 54321,
      growth_yoy_percentage: 4.5,
      highest_province: { name: "Jawa Barat", value: 15400 },
      lowest_province: { name: "Papua Barat", value: 120 },
      historical_trend: [
        { year: "2020", total: 48000 },
        { year: "2021", total: 50000 },
        { year: "2022", total: 52000 },
        { year: "2023", total: 53000 },
        { year: "2024", total: 54000 },
        { year: "2025", total: 54321 }
      ]
    }];
  });

  mock.onGet(new RegExp(url.GET_WORSHIP_PROVINCES + ".*")).reply(config => {
    const provinces = [
      { province_id: "ID-JB", province_name: "Jawa Barat", total_units: 15400, growth_percentage: 2.1, national_contribution: 25 },
      { province_id: "ID-JT", province_name: "Jawa Tengah", total_units: 12100, growth_percentage: 1.5, national_contribution: 20 },
      { province_id: "ID-JI", province_name: "Jawa Timur", total_units: 11500, growth_percentage: 1.8, national_contribution: 18 },
      { province_id: "ID-SU", province_name: "Sumatera Utara", total_units: 5400, growth_percentage: 0.5, national_contribution: 10 },
      { province_id: "ID-AC", province_name: "Aceh", total_units: 3200, growth_percentage: 1.2, national_contribution: 6 },
      { province_id: "ID-JK", province_name: "DKI Jakarta", total_units: 2100, growth_percentage: 0.8, national_contribution: 4 },
      { province_id: "ID-BT", province_name: "Banten", total_units: 1800, growth_percentage: 1.1, national_contribution: 3 },
      { province_id: "ID-SS", province_name: "Sumatera Selatan", total_units: 1500, growth_percentage: 0.9, national_contribution: 3 },
      { province_id: "ID-RI", province_name: "Riau", total_units: 1200, growth_percentage: 1.0, national_contribution: 2 },
      { province_id: "ID-SB", province_name: "Sumatera Barat", total_units: 1100, growth_percentage: 0.7, national_contribution: 2 },
    ];
    return [200, provinces];
  });

}

export default fakeBackend
