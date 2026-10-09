import type {NavigatorScreenParams} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ShapeId} from '@/features/geometry/logic/geometry';

export type MathsStackParamList = {
  MathsMenu: undefined;
  CrossProduct: undefined;
  Percent: undefined;
  RightTriangle: undefined;
  Stats: undefined;
  Tolerance: undefined;
};

export type GeometryStackParamList = {
  GeometryMenu: undefined;
  Shape: {shapeId: ShapeId};
  Formulas: undefined;
  Composed: undefined;
  Scale: undefined;
};

export type PaintStackParamList = {
  PaintMenu: undefined;
  Mix: undefined;
  NetArea: undefined;
  Thinner: undefined;
  Thickness: undefined;
  GuideSurface: undefined;
  GuideShape: undefined;
  GuideDimensions: {shapeId: ShapeId};
  GuideKnownSurface: undefined;
  GuideProduct: undefined;
  GuideResult: undefined;
};

export type RootTabParamList = {
  // `initial` = nombre à afficher (écrit à la française) ; `nonce` force la prise en compte même si le nombre est identique
  Calculator: {initial?: string; nonce?: number} | undefined;
  Maths: NavigatorScreenParams<MathsStackParamList>;
  Geometry: NavigatorScreenParams<GeometryStackParamList>;
  Conversions: undefined;
  Paint: NavigatorScreenParams<PaintStackParamList>;
};

export type MathsScreenProps<T extends keyof MathsStackParamList> =
  NativeStackScreenProps<MathsStackParamList, T>;
export type GeometryScreenProps<T extends keyof GeometryStackParamList> =
  NativeStackScreenProps<GeometryStackParamList, T>;
export type PaintScreenProps<T extends keyof PaintStackParamList> =
  NativeStackScreenProps<PaintStackParamList, T>;

export type RootTabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;
