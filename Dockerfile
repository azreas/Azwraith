FROM mhart/alpine-node:base
MAINTAINER zerolinke@gmail.com "zerolinke@gmail.com"
EXPOSE 3000
WORKDIR /azwraith
COPY ./ /azwraith
CMD node /azwraith/bin/www
