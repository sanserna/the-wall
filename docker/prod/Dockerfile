
FROM node:12

WORKDIR /Code/the-wall

COPY . .

# sometimes an image contains a large guid causing problems when you deploy it
# as documented here: https://circleci.com/docs/2.0/high-uid-error/
# Changing permissions fixes the problem but it needs to be done on the same
# layer as when you install dependencies (which is creating the file with the problem)
RUN yarn --prod && chown -R root:root .

EXPOSE 8080

ENV NODE_ENV=production

ENTRYPOINT [ "yarn", "start:prod" ]
