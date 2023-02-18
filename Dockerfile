FROM 056612754658.dkr.ecr.us-east-1.amazonaws.com/nodejs:18-alpine
RUN apk update \
    apk add curl \
            busybox-extra \
            net-tools \
            ngrep \
            bash \
            gnupg

# seperate step instll
COPY package.json /opt/email-service/package.json
RUN cd /opt/email-service && npm install

# seperate step build
COPY . /opt/email-service


# step run build
WORKDIR /opt/email-service

EXPOSE 8082

CMD ["npm", "start"]
