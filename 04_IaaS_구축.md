# 4강: IaaS 구축

> 원본: `4.2026년 새싹(SeSAC) 클라우드 네이티브 교육 자료(IaaS 구축).pdf` (66p)
> 대응 실습 결과물: `../01_실습자료/terraform_practice/`(원본 `20260709.zip`, tf1~tf3), `../main.tf` `../variables.tf` `../terraform.tfvars` (실습3 완성본)

- **대상 플랫폼**: NHN Cloud (OpenStack 기반 퍼블릭 클라우드), 콘솔: `https://opa.console.nhncloud.com/`
- **구축 대상**: Kubernetes 클러스터용 인스턴스 5대 — Control Plane 1 + Worker 3 + NFS 1

## 목차
1. **IaaS 구성 (콘솔 실습)** — 대시보드 접속, 네트워크 설정, 인스턴스 설정, 네트워크 인터페이스 설정, 인스턴스 접속, (참고)VIM
2. **IaC 클라우드인프라구축 — Terraform 실습** — 테라폼 정의/설치/CLI/파일구성, 실습1~3

---

## A. 콘솔 기반 IaaS 구축 절차

1. NHN Cloud 콘솔 로그인 → 프로젝트 선택
2. **서브넷 생성**: [Network]→[Subnet]→[서브넷생성], VPC CIDR 내 서브넷 CIDR 설정 (예: `192.168.1.0/24`), 이름 규칙 `edu{번호}-subnet`
3. **라우팅테이블 연결**: [Network]→[Subnet]→[라우팅테이블연결]
4. **인스턴스 생성(1~6단계)**: [Compute]→[Instance]→[인스턴스생성]
   1. 이미지: Ubuntu 22.04
   2. 인스턴스 정보(가용존 kr-pub-a, 플레이버 `r2.c2m8`) + 루트블록스토리지(SSD 50GB) — 컨트롤플레인1/워커3/NFS1 총 5대
   3. 키페어 생성(`K-PaaS-Key{번호}`)
   4. 키페어(.pem) 다운로드 및 보관
   5. 네트워크 설정에서 서브넷 선택
   6. 확인 후 [인스턴스생성]
5. **플로팅 IP 설정**: Control Plane 노드 → [플로팅 IP 관리] → [+생성] → [연결]
6. **네트워크 인터페이스 설정**: [Network]→[Network Interface]→생성 (Control Plane과 동일 VPC/서브넷)
7. **네트워크 인터페이스 연결(추가)**: 대상 인스턴스 **먼저 중지** → [네트워크]탭→[연결추가]→기존 인터페이스 선택 → [인스턴스 시작]
8. **인스턴스 접속**:
   - `.pem` 키 내용 복사 → SSH 클라이언트(Xshell/MobaXterm)로 Control Plane 접속(user: `ubuntu`, Public Key 인증)
   - Control Plane 내부에서 `vim {파일명}.pem` 으로 키 사본 생성(로컬 키 내용 붙여넣기, `:wq!`)
   - `chmod 600 {pem키파일명}` (안 하면 SSH 에러)
   - `ssh -i {pem키파일명} ubuntu@{워커노드IP}` 로 Worker/NFS 노드 접속

### (참고) Vim 편집기
Insert(`i`) ↔ Normal(`Esc`) ↔ Command-line(`:`) 모드. 저장후종료 `:wq`, 무저장종료 `:q!`

---

## B. Terraform(IaC) 실습

### 설치 (Ubuntu)
```bash
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

### Terraform 파일 구성 (4개)
| 파일 | 역할 |
|---|---|
| `provider.tf` | 프로바이더 인증/리전 |
| `main.tf` | 실제 리소스 정의 |
| `variables.tf` | 변수 선언(타입 지정) |
| `terraform.tfvars` | 변수 실제 값 |

### CLI 명령어
| 명령어 | 의미 |
|---|---|
| `terraform version` | 버전 정보 |
| `terraform init` | 작업 디렉터리 초기화(프로바이더 플러그인 설치) |
| `terraform validate` | 코드 구문 오류 확인 |
| `terraform plan` | 실행 계획 생성 |
| `terraform apply` | 인프라 배포 |
| `terraform destroy` | 인프라 삭제 |

### 실습 단계
1. **실습1**: 값을 하드코딩한 `provider.tf`/`main.tf` 작성 (VPC/Subnet/SecurityGroup/이미지 조회 → NIC 생성 → 인스턴스 1대 → 플로팅IP 연결) → `init`→`plan`→`apply`
2. **실습2**: 실습1의 하드코딩 값을 변수(`var.xxx`)로 치환 — `variables.tf`에 변수 선언, `terraform.tfvars`에 값 대입
3. **실습3(과제)**: 실습2를 확장해 인스턴스 4대 추가, 총 5대(Master 1, Worker 3, NFS 1) 배포하는 코드 작성 → **`../main.tf`/`variables.tf`/`terraform.tfvars`에 완성본이 남아 있음**

### Terraform 핵심 리소스 예시 (실습3 기준, `../main.tf` 참고)
```hcl
data "openstack_networking_network_v2" "nhn-network" { name = var.vpc_name }
data "openstack_networking_subnet_v2"  "nhn-subnet"  { ... }
data "openstack_networking_secgroup_v2" "nhn-sg"     { name = var.security_groups_name }
data "openstack_images_image_v2" "ubuntu_focal"      { name = var.os_ubuntu_name; most_recent = true }
data "openstack_networking_network_v2" "ext_network" { name = var.network_type_public }

resource "openstack_networking_port_v2" "nic"                   { ... }  # 마스터용 NIC
resource "openstack_compute_instance_v2" "instance1"             { ... }  # 마스터 인스턴스
resource "openstack_networking_floatingip_v2" "fip_1"            { ... }  # 플로팅 IP
resource "openstack_compute_floatingip_associate_v2" "fip_1"     { ... }  # 마스터에만 연결

# nic2~nic5 / instance2~instance5 로 worker1~3, nfs 반복 정의
```

---

## 중요 용어集

| 용어 | 설명 |
|---|---|
| CIDR | IP 주소 범위 표기법 (예: 192.168.1.0/24) |
| Control Plane 노드 | Kubernetes 클러스터의 마스터 노드 |
| Worker 노드 | 워크로드를 실제 실행하는 노드 |
| NFS 노드 | 클러스터 공유 파일 스토리지(NFS) 제공 노드 |
| Provider | Terraform이 특정 클라우드 API와 통신하기 위한 플러그인/인증정보 |
| Data Source | 기존 리소스를 조회하는 블록 (`data "..." "..." {}`) |
| Resource | 새로 생성/관리할 인프라 객체 정의 블록 (`resource "..." "..." {}`) |
| Variable | `variables.tf`의 입력 변수 (string/number/bool/list/object) |
| tfvars | 변수에 실제 값을 대입하는 파일 |
