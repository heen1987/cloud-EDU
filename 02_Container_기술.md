# 2강: Container 기술

> 원본: `2.2026년 새싹(SeSAC) 클라우드 네이티브 교육 자료(Container 기술).pdf` (65p)
> 대응 실습 결과물: `../01_실습자료/docker_dockerfile_practice/` (원본 `20260708.zip`), `edu-msa-zuul-1.0.0.war/.zip`

## 목차
1. **01 Container** — 정의, Hypervisor vs Container, Container Engine & Runtime
2. **02 Docker** — 정의, Dockerfile/Image/Container 관계, Dockerfile 작성법, 설치, CLI
3. **03 Docker Compose** — 정의, CLI, 도커 vs 도커컴포즈 실습
4. **04 Dockerfile** — 실습1) 단일 Dockerfile, 실습2) docker-compose로 다중 빌드
5. **05 이미지 생성** — MSA 애플리케이션, war 생성, Docker Hub 푸시 실습

---

## 핵심 개념 정리

### 01 Container
- **정의**: 가상화된 OS 위에서 애플리케이션 독립 실행에 필요한 파일(소스코드, 라이브러리 등)을 모은 패키지 (출처: Google Cloud, Azure)
- **VM vs Container**: VM은 Hypervisor 위에 Guest OS를 각각 두지만, Container는 Host OS 위에서 Container Engine이 Bin/Libs+APP만 격리 실행 (Guest OS 불필요 → 경량)
- **장점**: 기민한 생성·배포, CI/CD, 개발/운영 관심사 분리, 가시성, 환경 간 일관성, 이식성, 리소스 격리를 통한 예측 가능한 성능
- **Container Engine vs Runtime**: Engine은 관리용 API/CLI 제공(docker-ce, Podman, rkt). Runtime은 실제 컨테이너 실행(OCI 준수 runC 대표, containerd·cri-o도 runC 의존)

### 02 Docker
- **정의**: 컨테이너를 관리·운영하는 오픈소스 가상화 플랫폼
- **Dockerfile → Image → Container 흐름**: Dockerfile을 **Build**하면 Image 생성, Image를 **Run**하면 Container 실행
- **Dockerfile 주요 명령어**
  | 명령어 | 설명 |
  |---|---|
  | FROM | 베이스 이미지 지정 |
  | WORKDIR | 작업 디렉토리 |
  | COPY | 파일 복사 |
  | RUN | 빌드 시 실행 명령 |
  | ARG | 빌드용 변수 |
  | EXPOSE | 노출 포트 |
  | ENTRYPOINT | 컨테이너 실행 시 수행 명령 |
- **설치(Ubuntu)**: GPG 키 등록 → apt 저장소 등록 → `apt update`로 설치

### 03 Docker Compose
단일 서버에서 여러 컨테이너를 하나의 서비스로 정의·관리하는 도구. `docker-compose.yml`에 `services`(image, volumes, environment, ports 등), `volumes`를 정의.

### 05 MSA 애플리케이션 이미지 생성 (edu-msa-zuul 실습)
- **구성**: UI(edu-msa-ui) + 세션(redis-msa-ui) + **API Gateway(edu-msa-zuul)** + 사용자/댓글/게시글 API + 각 API별 DB(mysql-msa-*)
- API Gateway가 여러 API 서버 End-Point를 단일화하여 라우팅·로드밸런싱 수행

---

## 주요 명령어 목록

### Docker CLI
| 명령어 | 설명 |
|---|---|
| `docker version` | 버전 정보 |
| `docker login` / `docker logout` | 레지스트리 로그인/로그아웃 |
| `docker build [options] [context]` | 이미지 빌드 |
| `docker tag image[:tag] target[:tag]` | 이미지에 태그 추가 |
| `docker pull [options] source` | 레지스트리에서 이미지 가져오기 |
| `docker push [options] image [dest]` | 이미지를 레지스트리로 전송 |
| `docker run [options] image [cmd]` | 새 컨테이너 실행 |
| `docker exec [options] container [cmd]` | 실행 중 컨테이너에서 명령 실행 |
| `docker stop container` | 정상 중지 |
| `docker kill container` | 즉시 종료 |
| `docker ps [-a] [-s]` | 컨테이너 목록 |
| `docker rm container` | 컨테이너 삭제 |
| `docker images` | 로컬 이미지 목록 |

### docker run 주요 옵션
| 옵션 | 설명 |
|---|---|
| `-d` | detached(백그라운드) 실행 |
| `-it` | 대화형 터미널 유지 |
| `--name` | 컨테이너 이름 부여 |
| `-e` | 환경변수 설정 |
| `-p` | 호스트:컨테이너 포트 매핑 |
| `--rm` | 종료 시 리소스 자동 제거 |

### Docker Compose CLI
| 명령어 | 설명 |
|---|---|
| `docker compose up [SERVICE...]` | 컨테이너 배포 |
| `docker compose down [SERVICE...]` | 종료 및 초기화(네트워크 포함 제거) |
| `docker compose stop` | 종료(네트워크·데이터 유지) |
| `docker compose start` | 재시작 |
| `docker compose restart` | 중지 후 재시작 |
| `docker compose ps` | 상태 확인 |
| `docker compose logs` | 로그 확인 |
| `docker compose build` | 이미지 빌드 |

---

## 중요 용어集

| 용어 | 설명 |
|---|---|
| OCI | 컨테이너 표준 규격 (runC가 준수) |
| Dockerfile | 이미지 생성을 위한 명령어 기반 설정 파일 |
| Docker Hub | 도커 공식 이미지 저장소(레지스트리) |
| WAR 파일 | 자바 웹 애플리케이션 배포용 압축 파일 |
| API Gateway(Zuul) | 여러 API의 End-Point를 단일화해 라우팅하는 컴포넌트 |

---

## 실습 절차 (재현 가능)

### 실습 1 — 단일 Dockerfile 빌드
`node:16-alpine` 기반 이미지를 만들고 확인:
```bash
docker build --no-cache -t docker-test:1.0 .
docker images
```

### 실습 2 — docker-compose로 다중 이미지 빌드
`alpine`, `ubuntu` 두 서비스를 `docker-compose.yaml`에 정의(각각 build context/dockerfile 지정):
```bash
docker compose build
docker images
```

### 실습 3 — MSA 애플리케이션(edu-msa-zuul) 이미지 생성·푸시
1. `git clone https://github.com/K-PaaS/edu-msa-file.git`
2. war 파일을 서버의 `/edu-msa-file/Docker/edu-msa-*` 폴더로 이동(MobaXterm sftp)
3. Dockerfile 위치에 war 파일 + application.yml 확인
4. Docker Hub에서 Repository 생성
5. ```bash
   docker login -u {DOCKER_HUB_ID}
   cd ~/edu-msa-file/Docker/edu-msa-zuul/
   docker build --tag edu-msa-zuul:latest .
   docker tag edu-msa-zuul ${DOCKER_HUB_ID}/edu-msa-zuul
   docker push ${DOCKER_HUB_ID}/edu-msa-zuul
   ```

> 이 프로젝트 폴더에 이미 `edu-msa-zuul-1.0.0.war`와 `edu-msa-zuul-1.0.0.zip`이 남아있어 이 실습을 재현할 수 있습니다.
