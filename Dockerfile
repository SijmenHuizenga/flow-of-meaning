FROM node
COPY . /project
WORKDIR /project
RUN npm i
ENTRYPOINT ["node", "main.js"]
ENV GOOGLE_APPLICATION_CREDENTIALS=/project/creds.gcloud