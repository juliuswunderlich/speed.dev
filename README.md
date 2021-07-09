# Speed.dev
This application is absolutely fire. One might say it f***s!
Learn how to code hella fast (fingerwise not like brainwise)!

## Docker instructions
```
docker build -t speeddev .
docker run -p 3000:3000 -it speeddev

```
Alternatively, use -v to mount the directory on host as a volume inside the image,
so we don't need to rebuild and rerun the docker image after changes to the source code:
(doesn't work on windows?)

Docker committing seems like the way to go:
    Make whatever changes you want to your docker container instance.
    Then get the container id using this command
    
    sudo docker ps -l 

    Commit changes to the container:
    sudo docker commit <container_id> <new-image-name>

    Then run the container:
    sudo docker run <new-image-name> <command>



```
docker run -p 3000:3000 -v host/path/:/app/backend -it speeddev
```
# speed.dev

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
