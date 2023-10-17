---
id: Idempotency
title: Idempotency (v1.0.0)
sidebar_label: Idempotency
description: This glossary has an explanation of all the terminologies that beginners find difficult to understand at first glance.
tags:
  - explanation
keywords:
  - API
---

Idempotence is a property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application. In other words, if an operation is idempotent, then applying it twice will have the same effect as applying it once.

It is also important in RESTful APIs. RESTful APIs are designed to be stateless, which means that the server does not need to keep track of the state of a client's request. This makes RESTful APIs more scalable and reliable.

### Examples of idempotent HTTP methods:

- GET: The GET method is used to retrieve a resource. It is idempotent because retrieving a resource multiple times will always result in the same response.
- PUT: The PUT method is used to update a resource. It is idempotent because updating a resource multiple times will only update the resource once.
- DELETE: The DELETE method is used to delete a resource. It is idempotent because deleting a resource multiple times will only delete the resource once.
