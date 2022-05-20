import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { AppService } from './AppService';

interface defaultInfo {
  tableTitles: Array<tableTitle>,
  tableDatas: tableDatas
};

interface tableTitle {
  menuType: string,
  name: string,
};

interface tableDatas {
  [key: string]: tableData,
};

interface tableData {
  menu: Array<string>,
  val: Array<string>,
  isSelected: Array<boolean>,
};

interface searchInfo {
  // [key: string]: string | Array<string>,
  stDate: string,
  endDate: string,
  stateVal: Array<string>,
  payVal: Array<string>,
  searchText: string,
};

function App() {

  // 제휴사 여부 확인 - useQuery로 대체 예정
  const [isCompany, setIsCompany] = useState(true);

  // 검색메뉴 - 지급방식
  // const [pay, setPay] = useState({ 
  //   menu: ['전체', '선불', '착불', '카드', '송금'],
  //   val: ['전체', '선불', '착불', '카드', '송금'],
  //   isSelected: [false, false, false, false, false],
  // });

  // 제휴사 여부 확인
  useEffect(() => {

    if (isCompany) {
      setIsCompany(prev => true);
      setDefaultInfo(prev => ({
        ...prev,
        tableDatas: {
          ...prev.tableDatas,
          pay: {
            ...prev.tableDatas.pay,
            menu: ['전체', '계약', '선불', '착불', '카드', '송금'],
            val: ['전체', '계약', '선불', '착불', '카드', '송금'],
            isSelected: [false, false, false, false, false, false],
          },
        }

      }));
    };
  }, [isCompany]);

  // 검색메뉴
  const [defaultInfo, setDefaultInfo] = useState<defaultInfo>({
    tableTitles: [{ menuType: 'date', name: '조회기간' }, { menuType: 'state', name: '조회구분' }, { menuType: 'pay', name: '지급방식' }],
    tableDatas: {
      date: {
        menu: ['오늘', '어제', '최근7일', '당월', '전월'],
        val: ['0', '1', '2', '3', '4'],
        isSelected: [true, false, false, false, false],
      },
      state: {
        menu: ['전체', '완료', '취소', '진행중', '예약'],
        val: ['전체', '완료', '취소', '진행중', '예약'],
        isSelected: [false, false, false, false, false],
      },
      pay: {
        menu: ['전체', '선불', '착불', '카드', '송금'],
        val: ['전체', '선불', '착불', '카드', '송금'],
        isSelected: [false, false, false, false, false],
      },
    },
  });

  // 검색조건
  const [searchInfo, setSearchInfo] = useState<searchInfo>({
    stDate: AppService.getDate('0'),
    endDate: AppService.getDate('0'),
    stateVal: [],
    payVal: [],
    searchText: '',
  });

  // 검색조건 선택
  const handleSearchCondition = (e: MouseEvent) => {

    const idx = e.currentTarget.getAttribute('data-idx') as string;
    const menuType = e.currentTarget.getAttribute('data-menutype') as string;
    const isSelected = defaultInfo.tableDatas[menuType].isSelected;
    console.log('isSelected', isSelected);
    
    console.log('isSelected', isSelected);

    switch (menuType) {
      case 'date':
        setSearchInfo(prev => ({ ...prev, stDate: AppService.getDate(idx), endDate: AppService.getDate('0') }));
        break;
      case 'state':
        setSearchInfo(prev => ({ ...prev, stateVal: [...prev.stateVal, defaultInfo.tableDatas[menuType].val[idx as unknown as number]] }));
        break;
      case 'pay':
        setSearchInfo(prev => ({ ...prev, payVal: [...prev.payVal, defaultInfo.tableDatas[menuType].val[idx as unknown as number]] }));
        break;
      default:
        break;
    };

    isSelected[idx as unknown as number] = !isSelected[idx as unknown as number];
    setDefaultInfo(prev => ({
      ...prev,
      tableDatas: {
        ...prev.tableDatas,
        [menuType]: {
          ...prev.tableDatas[menuType],
          isSelected: isSelected,
        }
      },
    }));
  };

  console.log(defaultInfo);
  // console.log(searchInfo);

  // 달력날짜 변경
  const handleCalendar = (e: ChangeEvent<HTMLInputElement>) => {

    const type = e.currentTarget.getAttribute('data-name');
    const selectedValue = (e.target as HTMLInputElement).value;

    // type 구분 && 날짜 유효성 검사
    if (type === 'stDate' && AppService.validateDate(selectedValue, searchInfo.endDate as string)) {
      setSearchInfo(prev => ({ ...prev, stDate: selectedValue }));
    }
    else if (type === 'endDate' && AppService.validateDate(searchInfo.stDate as string, selectedValue)) {
      setSearchInfo(prev => ({ ...prev, endDate: selectedValue }));
    }
    else {
      alert('날짜를 확인해주세요.');
    };
  };

  // 제휴사 선택버튼 클릭
  const handleCompany = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('제휴사 선택');
    // 조회구분 css / 지급방식 css 컨트롤 필요 - searchInfo
    setSearchInfo(prev => ({ ...prev, stateVal: [...prev.stateVal, defaultInfo.tableDatas.state.val[0]] }));
    setSearchInfo(prev => ({ ...prev, payVal: [...prev.payVal, defaultInfo.tableDatas.pay.val[0], defaultInfo.tableDatas.pay.val[1]] }));
  };

  return (
    <div className="App">
      {
        isCompany ? <div><p>제휴사 {'>'} 올바로</p><button onClick={handleCompany}>제휴사 선택{'→'}</button></div> : null
      }
      <table >
        <tbody >
          {
            defaultInfo.tableTitles.map((tableTitle) => (
              <tr key={tableTitle.name}>
                <td>{tableTitle.name}</td>
                {
                  // 검색메뉴 목록
                  defaultInfo.tableDatas[tableTitle.menuType].menu.map((item: string, idx: number) => <td className={defaultInfo.tableDatas[tableTitle.menuType].isSelected[idx] ? "active" : ""} onClick={handleSearchCondition} data-idx={idx} data-menutype={tableTitle.menuType} key={item}>{item}</td>)
                }
                {
                  // 조회기간 달력추가
                  tableTitle.menuType === 'date' && (
                    <td>
                      <input data-name="stDate" onChange={handleCalendar} type='date' value={searchInfo.stDate} /> ~ <input data-name="endDate" onChange={handleCalendar} type='date' value={searchInfo.endDate} />
                    </td>
                  )
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
