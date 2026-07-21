# 3강: IaaS 이론

> 원본: `3.2026년 새싹(SeSAC) 클라우드 네이티브 교육 자료(IaaS 이론).pdf` (68p)

이 강의는 "가상화/하이퍼바이저 일반 이론"보다 **K-PaaS 오픈소스 컨테이너 플랫폼 구성요소**와 **NHN Cloud 콘솔에서 IaaS 리소스(네트워크·컴퓨팅)를 생성·설정하는 실습형 구성**으로 되어 있습니다.

## 목차
1. **컨테이너플랫폼 이해** (K-PaaS 표준모델)
2. **컨테이너플랫폼 오픈소스 — K-PaaS 주요소프트웨어**
   - 클러스터구성 소프트웨어 (Kubespray, Kubernetes, CRI-O, Calico, MetalLB, Ingress Nginx, Helm, Istio, Podman, OpenTofu, NFS, Rook Ceph)
   - 포털구성 소프트웨어 (Vault, Harbor, MariaDB, Keycloak)
3. **클라우드컴퓨팅 리소스 이해 — NHN Cloud**
   - Network 메뉴 (VPC, Subnet, Network Interface, Routing, Floating IP, Security Groups, Internet Gateway)
   - Compute 메뉴 (Instance, Key Pair)

---

## 핵심 개념 정리

### 1) 컨테이너플랫폼 (K-PaaS 표준모델)
- 클라우드 인프라 위에서 SW/서비스를 개발·실행·운영·관리하는 기반 SW 환경
- Container Platform = 쿠버네티스 기반 단독 배포 기능 + 클라우드 서비스·운영에 필요한 부가 서비스를 지원하는 오픈소스 PaaS 플랫폼
- 구성: **쿠버네티스 클러스터 + 스토리지 서버**, 디스크립션(설정 정의) 기반 배포
- 배포 방식: **단독형 배포** — 독립된 쿠버네티스 환경 제공

### 2) K-PaaS 오픈소스 소프트웨어 구성

| 구분 | 오픈소스명 |
|---|---|
| 클러스터구성 소프트웨어 | Kubespray, Kubernetes, CRI-O, Calico, MetalLB, Ingress Nginx Controller, Helm, Istio, Podman, OpenTofu, Kubeflow, NFS, Rook Ceph |
| 포털구성 소프트웨어 | Vault, Harbor, MariaDB, Keycloak |

(출처: K-PaaS 대표포털 k-paas.or.kr, 대부분 Apache License 2.0)

### 3) NHN Cloud 리소스(IaaS) 이해
- NHN Cloud 콘솔에서 "이해(개념) → 생성 → 설정" 3단계로 반복 설명
- **Network 메뉴 흐름**: VPC → Subnet(Routing Table 연결 필수) → Network Interface(플로팅IP 연결, 인스턴스 연결 시 인스턴스 중지 필요) → Routing(Internet Gateway 연결 필수) → Floating IP → Security Groups → Internet Gateway
- **Compute 메뉴 흐름**: Instance 생성(스토리지 → 인스턴스 정보 → 타입 → 키페어 → 네트워크 → 플로팅IP → 보안그룹 → 생성 → 확인) → Key Pair(SSH 공개키/개인키)

---

## 중요 용어集

| 용어 | 설명 |
|---|---|
| Container Platform | 쿠버네티스 기반 단독 배포+부가서비스를 지원하는 오픈소스 PaaS |
| Kubespray | Ansible 기반 쿠버네티스 클러스터 자동 구축 도구 |
| CRI-O | 쿠버네티스용 OCI 표준 컨테이너 런타임(경량, 이미지 빌드 기능 없음) |
| Calico | L3 기반 가상 네트워크 CNI 플러그인 |
| MetalLB | Kubernetes Service를 LoadBalancer 타입으로 노출 (L2/L3) |
| Ingress Nginx Controller | Ingress 리소스 규칙을 실제 적용·관리 |
| Helm | 쿠버네티스 패키지 매니저(차트 기반) |
| Istio | 마이크로서비스 간 통신 관리 서비스 메시 |
| Podman | 데몬리스 리눅스 컨테이너 관리 도구 |
| OpenTofu | Terraform 대체 오픈소스 IaC 도구 |
| NFS | 네트워크 기반 분산 파일 공유 시스템 |
| Rook Ceph | Ceph 분산 스토리지를 쿠버네티스에서 자가관리 운영 (CNCF Graduated) |
| Vault | 시크릿(토큰/키/비밀번호/인증서) 중앙 관리 시스템 |
| Harbor | 웹 UI 기반 사설 컨테이너 이미지 레지스트리 |
| MariaDB | MySQL 호환 오픈소스 RDBMS |
| Keycloak | OIDC/SAML/OAuth 2.0 기반 IAM·SSO 오픈소스 |
| VPC | 논리적으로 격리된 가상 네트워크 |
| Subnet | IP 네트워크를 세분화한 IP 주소 영역 |
| Network Interface | VPC 내 가상 네트워크 카드 |
| Routing(Table) | CIDR 기반 트래픽 전달 경로 테이블 |
| Floating IP | 인터넷에서 인스턴스에 직접 접근하기 위한 공인 IP |
| Security Groups | 인스턴스 송수신 트래픽을 제어하는 방화벽 규칙 |
| Internet Gateway | VPC 리소스를 인터넷에 연결하는 게이트웨이 |
| Instance | 가상 CPU/메모리/루트 블록 스토리지로 구성된 가상 서버 |
| Key Pair | PKI 기반 SSH 공개키/개인키 쌍(인스턴스 접속 인증) |

## 실무 제약사항 (강조된 의존관계)
- Subnet은 Routing Table과 연결 **필수**
- Routing은 Internet Gateway와 연결 **필수**
- Network Interface에 Floating IP 연결 가능
- 인스턴스에 Network Interface를 추가 연결하려면 **인스턴스 중지 필요**
