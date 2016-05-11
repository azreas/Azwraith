FROM zzrot/alpine-node
MAINTAINER zerolinke@gmail.com "zerolinke@gmail.com"
EXPOSE 3000
WORKDIR /azwraith
COPY ./ /azwraith
CMD node /bin/www
