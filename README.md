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

```
docker run -p 3000:3000 -v host/path/:/app/backend -it speeddev
```