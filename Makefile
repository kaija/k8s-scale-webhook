TAG=v1.0
NAME=scale_webhook
USER=kaija
API_HOST=1.2.3.4
API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

all: image

image:
	docker build -t ${USER}/${NAME}:${TAG} .

run:
	docker run -d -p 8080:8080 -e PORT=8080 --name ${NAME} ${NAME}:${TAG}

run_debug:
	docker run -p 8080:8080 -e PORT=8080 -e KUBERNETES_SERVICE_HOST=${API_HOST} -e KUBERNETES_API_TOKEN=${API_TOKEN} --name ${NAME}  ${USER}/${NAME}:${TAG}

stop:
	docker rm ${NAME}
	docker stop ${NAME}
