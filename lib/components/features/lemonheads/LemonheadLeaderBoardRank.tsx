import { match } from 'ts-pattern';

function FirstMedal() {
  return (
    <div
      className="size-8 aspect-square rounded-full flex items-center justify-center"
      style={{
        background:
          'linear-gradient(135deg, #856220 15.43%, #F4E683 34.91%, #BF923D 50.85%, #4E341B 68.56%, #F1EA82 86.26%)',
      }}
    >
      <div className="bg-page-background-overlay flex items-center justify-center size-6 aspect-square rounded-full mix-blend-overlay">
        <p className="text-sm">1</p>
      </div>
    </div>
  );
}

function SecondMedal() {
  return (
    <div
      className="size-8 aspect-square rounded-full flex items-center justify-center"
      style={{
        background:
          'linear-gradient(138deg, #3A3A3A 2.28%, #A4A4A4 19.8%, #606060 32.94%, #CECECE 50.16%, #8F8F8F 62.15%, #464646 78.69%, #696969 95.24%)',
      }}
    >
      <div className="bg-page-background-overlay flex items-center justify-center size-6 aspect-square rounded-full mix-blend-overlay">
        <p className="text-sm">2</p>
      </div>
    </div>
  );
}

function ThirdMedal() {
  return (
    <div
      className="size-8 aspect-square rounded-full flex items-center justify-center"
      style={{
        background:
          'linear-gradient(135deg, #9E8976 15.43%, #7A5E50 30.62%, #F6D0AB 47.37%, #9D774E 62.96%, #C99B70 82.05%, #795F52 93.35%)',
      }}
    >
      <div className="bg-page-background-overlay flex items-center justify-center size-6 aspect-square rounded-full mix-blend-overlay">
        <p className="text-sm">3</p>
      </div>
    </div>
  );
}

export function LemonheadLeaderBoardRank({ rank }: { rank: number }) {
  return (
    <>
      {match(rank)
        .with(1, () => <FirstMedal />)
        .with(2, () => <SecondMedal />)
        .with(3, () => <ThirdMedal />)
        .otherwise(() => (
          <div className="flex justify-center items-center bg-(--btn-tertiary) rounded-full border aspect-square size-8">
            <p className="text-sm">{rank}</p>
          </div>
        ))}
    </>
  );
}
