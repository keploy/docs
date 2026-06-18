---
id: perl-mongo
title: Sample Perl-MongoDB URL Shortener App
sidebar_label: Perl + MongoDB
description: The following sample app showcases how to use the Perl framework and the Keploy Platform.

tags:
  - perl
  - quickstart
  - samples
  - examples
  - tutorial
  - perl-framework
  - mongodb
keyword:
  - Perl Framework
  - MongoDB
  - API Test generator
  - Auto case generation
---

import Link from '@docusaurus/Link'
import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';

## Running App using Docker Compose 🐳

🪄 In this guide, you will set up a Perl-based URL Shortener using MongoDB and learn how Keploy enables automated API testing through record and replay modes. 🎢

<InstallReminder />

### Get Started! 🎬

Clone the repository and move to relevant folder

```bash
git clone https://github.com/keploy/samples-perl.git
cd samples-perl
```

We will be using Docker compose to run the application as well as Mongo on Docker container.

### Lights, Camera, Record! 🎥

Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
`-c`: Command to run the app (e.g., `docker compose up`).

`--container-name`: The container name in the `docker-compose.yml` for traffic interception.

```bash
keploy record -c "docker compose up" --container-name=perl-app
```

![Keploy record mode session for Perl and MongoDB application](/img/oss/perl-mongo-1.png)

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

### Let's generate the testcases.

Make API Calls using Postman or cURL command. Keploy will capture those calls to generate the test-suites containing testcases and data mocks.

**1. POST /shorten**

```bash
curl -X POST http://localhost:5000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://keploy.io"}'
```

Here's a peek of what you get:

```bash
{
  "code": "QWERTY",
  "shortUrl": "http://localhost:5000/QWERTY"
}
```

🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

_Time to perform more API magic!_
Follow the breadcrumbs... or Make more API Calls

**2. Redirect Call**

Suppose the received code is `QWERTY`

```bash
curl -v http://localhost:5000/QWERTY
```

This is return 302 status code and redirect to the original url if code is correct.

```bash
HTTP/1.1 302 Found
Location: https://keploy.io
```

**3. Check Stats**
```bash
curl http://localhost:5000/stats/QWERTY
```

This will return the stats of the short url.

```bash
{
  "clicks": 1,
  "code": "QWERTY",
  "createdAt": "2026-01-30T06:47:03Z",
  "originalUrl": "https://keploy.io"
}
```

**4. Negative Case**
```bash
curl http://localhost:5000/XXXXXX
```

This is give error:

```bash
{
  "error": "Short URL code not found"
}
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --container-name=perl-app --delay 10
```

![Keploy test mode execution showing passed tests for Perl and MongoDB application](/img/oss/perl-mongo-2.png)

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

<SectionDivider />

## Running App Locally on Linux/WSL 🐧

🪄 In this guide, you will set up a Perl-based URL Shortener using MongoDB and learn how Keploy enables automated API testing through record and replay modes. 🎢

<InstallReminder />

### Get Started! 🎬

Clone the repository and move to relevant folder

```bash
git clone https://github.com/keploy/samples-perl.git
cd samples-perl
```

Make sure you have Perl installed 🐪, Docker set up 🐳, and Keploy installed 🐰 before proceeding.

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (MongoDB) chill on Docker. Ready? Let's get the party started!🎉

### Install cpanm

Ubuntu:
```bash
sudo apt update
sudo apt install cpanminus -y
```
MacOS:
```bash
brew install cpanminus
```
Windows:
```bash
cpan App::cpanminus
```

### Install Dependencies

```bash
cpanm --installdeps .
```

### Start the MongoDB container

```bash
docker compose up -d mongo
```

### Confirm Server behavior

```bash
perl app.pl daemon -l http://localhost:5000
```

Should say:

```bash
Web application available at http://localhost:5000
```

### 📼 Roll the Tape - Recording Time!

Ready, set, record! Here's how:

```bash
keploy record -c "perl app.pl daemon -l http://localhost:5000"
```

![Keploy record mode session for Perl and MongoDB application](/img/oss/perl-mongo-1.png)

Keep an eye out for the `-c `flag! It's the command charm to run the app.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

### Let's generate the testcases.

Make API Calls using Postman or cURL command. Keploy will capture those calls to generate the test-suites containing testcases and data mocks.

**1. POST /shorten**

```bash
curl -X POST http://localhost:5000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://keploy.io"}'
```

Here's a peek of what you get:

```bash
{
  "code": "QWERTY",
  "shortUrl": "http://localhost:5000/QWERTY"
}
```

🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

_Time to perform more API magic!_
Follow the breadcrumbs... or Make more API Calls

**2. Redirect Call**

Suppose the received code is `QWERTY`

```bash
curl -v http://localhost:5000/QWERTY
```

This is return 302 status code and redirect to the original url if code is correct.

```bash
HTTP/1.1 302 Found
Location: https://keploy.io
```

**3. Check Stats**
```bash
curl http://localhost:5000/stats/QWERTY
```

This will return the stats of the short url.

```bash
{
  "clicks": 1,
  "code": "QWERTY",
  "createdAt": "2026-01-30T06:47:03Z",
  "originalUrl": "https://keploy.io"
}
```

**4. Negative Case**
```bash
curl http://localhost:5000/XXXXXX
```

This is give error:

```bash
{
  "error": "Short URL code not found"
}
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "perl app.pl daemon -l http://localhost:5000" --delay 10
```

![Keploy test mode execution showing passed tests for Perl and MongoDB application](/img/oss/perl-mongo-2.png)

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀
