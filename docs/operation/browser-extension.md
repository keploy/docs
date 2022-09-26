---
id: browser-extension-operations
title: Browser Extension Operations
description: Guide into Keploy Browser Extension
sidebar_label: Browser Extension
tags:
  - browser-extension
  - plugin
---

## Prerequisites

1. [golang](https://go.dev/dl/)
2. [Docker](https://docs.docker.com/get-docker/)
3. [GCC compiler](https://sourceforge.net/projects/tdm-gcc/)
4. [selenium IDE extension](https://chrome.google.com/webstore/detail/selenium-ide/mooikfkahbdckldjjndioackbalphokd?hl=en)
5. [Keploy](https://github.com/keploy/keploy)

## Install Keploy on PC

```
git clone https://github.com/keploy/keploy.git
```

Now come inside this directory and run this project in docker by putting the command mentioned below.

```
docker-compose -f docker-compose-dev.yaml up
```

Install the Keploy browser extension from the link: https://github.com/keploy/browser-extension/releases

After installing the browser extension go inside your extension manager and switch on the developer mode.

![alt text](https://miro.medium.com/max/828/1*xQcKiTOy2bak4Lo9k_qsTg.png)

After that go on the load unpacked button, which appears just after switching on the developer mode and import your extension file from the expected location.

![alt text](https://miro.medium.com/max/828/1*cdRr3Neb1lsDRzHztdWmSA.png)

Now your extension is ready to use, and along with that, your Keploy server is already running in docker because we started Keploy server inside docker at the beginning of the documentation.

Now we are having

- Selenium extension installed

- Keploy extension installed

- Keploy tool is installed and running in docker

Now start testing the front end of the desired website using selenium ide extension, already downloaded and present in the chrome extension list. The Keploy extension will keep on running in the background once keploy server is up.

**Step-1**: Create a new project and rename it, or you can also open an existing project

![alt text](https://miro.medium.com/max/750/1*K6-I3fOHGu29sgUEjcpxUA.png)

![alt text](https://miro.medium.com/max/750/1*lEwF0okhMyKzaS2a8dPA7Q.png)

**Step-2**: Give a title to your 1st test case

![alt text](https://miro.medium.com/max/828/1*u1VNf-nXXvekruNphAIfIQ.png)
![alt text](https://miro.medium.com/max/378/1*CL3156yKX4UhklO3l_vH4Q.png)
![alt text](https://miro.medium.com/max/750/1*0KeAj9Nij6i1_-Gd_265uA.png)

**Step-3**: Put the URL of the desired website for testing.

![alt text](https://miro.medium.com/max/640/1*zkGIhYuzH6MVIhk4ByTpkg.png)

**Step-4**: Press on the record button present in the top right corner.

![alt text](https://miro.medium.com/max/456/1*OJBhp3uWaOnNaOynI_jigw.png)

**Step-5**: Now default browser will open, In our case, it’s the chrome browser.

**Step-6**: Perform your desired actions and selenium will start recording the positions and actions along with the data present at that place.

**Step-7**: In our case we are doing a google search with the keyword oss. We can see many search results present in the suggestion but we will go with the 1 st option.

![alt text](https://miro.medium.com/max/828/1*9wXASZ3JLur3r_Gk2Q-gug.jpeg)
![alt text](https://miro.medium.com/max/828/1*4ur53dlBZ94Y2gbJCZLYJA.jpeg)

**Step-8**: We know that our keploy server is already running in the background and keploy extension is present in the chrome browser. In the background, our keploy server is recording all the data coming from APIs on the front end in mongo DB. Let’s see inside mongo DB using mongo compass.

![alt text](https://miro.medium.com/max/828/1*WYChY6_nwLcmUJw5I-j7Dg.jpeg)

**Step-9**: Now we will replay the recorded data in selenium, but this time data will not come from live servers of google, instead of that data will come from the moc database made by keploy

![alt text](https://miro.medium.com/max/828/1*9wXASZ3JLur3r_Gk2Q-gug.jpeg)
![alt text](https://miro.medium.com/max/828/1*4ur53dlBZ94Y2gbJCZLYJA.jpeg)

**Step-10**: Now because of the static database all the selenium test cases will pass.

![alt text](https://miro.medium.com/max/828/1*LGHdZuf_GnlMamxJGYKXUg.png)
