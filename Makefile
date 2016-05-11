TAG=latest
Author=zerolinke
Repository=azwraith
Dockerfile=Dockerfile

clean:
	@rm -rf node_modules

media:
	@npm install


image: media
	@echo Building $(Author)/$(Repository):$(TAG) image use $(Dockerfile)
	@docker build -t "$(Author)/$(Repository):$(TAG)" -f $(Dockerfile) .

release: media image
	@docker push $(Author)/$(Repository):$(TAG)